package com.hanium.diarist.domain.diary.dto;

import com.hanium.diarist.domain.artist.domain.Artist;
import com.hanium.diarist.domain.diary.domain.Diary;
import com.hanium.diarist.domain.emotion.domain.Emotion;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryDetailResponse {
    private final String diaryDate;
    private final boolean favorite;
    private final String imageUrl;
    private final String emotionName;
    private final String emotionPicture;
    private final String artistName;
    private final String artistPicture;
    private final String content;


    @Builder(access = AccessLevel.PRIVATE)
    public DiaryDetailResponse(Diary diary,Artist artist,Emotion emotion) {
        this.diaryDate = diary.getDiaryDate().toString();
        this.favorite = diary.isFavorite();
        this.imageUrl = diary.getImage().getImageUrl();
        this.content = diary.getContent();
        this.emotionName = emotion.getEmotionName();
        this.emotionPicture = emotion.getEmotionPicture();
        this.artistName = artist.getArtistName();
        this.artistPicture = artist.getArtistPicture();
    }

    public static DiaryDetailResponse of(Diary diary, Emotion emotion, Artist artist) {
        return DiaryDetailResponse.builder()
                .diary(diary)
                .artist(artist)
                .emotion(emotion)
                .build();
    }

}
