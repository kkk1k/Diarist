package com.hanium.diarist.domain.diary.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanium.diarist.domain.diary.domain.Diary;
import com.hanium.diarist.domain.diary.dto.CreateDiaryResponse;
import com.hanium.diarist.domain.diary.exception.DiaryIdInvalidException;
import com.hanium.diarist.domain.diary.exception.DiaryNotFoundException;
import com.hanium.diarist.domain.diary.exception.JsonProcessException;
import com.hanium.diarist.domain.diary.exception.SseException;
import com.hanium.diarist.domain.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class CreateDiaryConsumerService {

    private static final Logger log = LoggerFactory.getLogger(CreateDiaryConsumerService.class);
    private final DiaryRepository diaryRepository;
    private final ObjectMapper objectMapper;
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter addEmitter(Long userId) {
        SseEmitter emitter = new SseEmitter(120000L);
        this.emitters.put(userId, emitter);
        emitter.onCompletion(() -> this.emitters.remove(userId));
        emitter.onTimeout(() -> this.emitters.remove(userId));
        emitter.onError(e -> this.emitters.remove(userId));
        return emitter;
    }

    private void sendToUser(Long userId, CreateDiaryResponse diaryResponse) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                String jsonResponse = objectMapper.writeValueAsString(diaryResponse);
                emitter.send(SseEmitter.event().data(jsonResponse));
            } catch (JsonProcessingException e) {
                throw new JsonProcessException();
            } catch (IOException e) {
                this.emitters.remove(userId);
                throw new SseException();
            }
        }
    }

    @KafkaListener(topics = "create-diary-response", groupId = "diary")
    public void consumeCreateDiaryResponse(HashMap<String, Object> message) {
        try {
            long diaryId = Long.parseLong(String.valueOf(message.get("diary_id")));
            long userId = Long.parseLong(String.valueOf(message.get("user_id")));
            log.info("consumeCreateDiaryResponse diaryId : {} , user_id : {}", diaryId, userId);
            Diary diary = diaryRepository.findByDiaryIdWithDetails(diaryId)
                    .orElseThrow(DiaryNotFoundException::new);

            CreateDiaryResponse createDiaryResponse = new CreateDiaryResponse(
                    diary.getEmotion().getEmotionName(),
                    diary.getEmotion().getEmotionPicture(),
                    diary.getContent(),
                    diary.getArtist().getArtistName(),
                    diary.getArtist().getArtistPicture(),
                    diary.getDiaryDate().toString(),
                    diary.getImage().getImageUrl()
            );

            sendToUser(userId, createDiaryResponse);
        } catch (NumberFormatException e) {
            throw new DiaryIdInvalidException();
        }
    }
}