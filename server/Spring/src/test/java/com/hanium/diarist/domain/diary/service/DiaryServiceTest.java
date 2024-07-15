package com.hanium.diarist.domain.diary.service;

import com.hanium.diarist.domain.artist.domain.Artist;
import com.hanium.diarist.domain.artist.domain.Period;
import com.hanium.diarist.domain.artist.repository.ArtistRepository;
import com.hanium.diarist.domain.diary.domain.Diary;
import com.hanium.diarist.domain.diary.domain.Image;
import com.hanium.diarist.domain.diary.dto.AlbumResponse;
import com.hanium.diarist.domain.diary.dto.BookmarkDiaryResponse;
import com.hanium.diarist.domain.diary.dto.DiaryDetailResponse;
import com.hanium.diarist.domain.diary.dto.DiaryListResponse;
import com.hanium.diarist.domain.diary.exception.DiaryNotFoundException;
import com.hanium.diarist.domain.diary.repository.DiaryRepository;
import com.hanium.diarist.domain.diary.repository.ImageRepository;
import com.hanium.diarist.domain.emotion.domain.Emotion;
import com.hanium.diarist.domain.emotion.repository.EmotionRepository;
import com.hanium.diarist.domain.user.domain.SocialCode;
import com.hanium.diarist.domain.user.domain.User;
import com.hanium.diarist.domain.user.repository.UserRepository;
import com.hanium.diarist.domain.user.service.ValidateUserService;
import jakarta.validation.constraints.Min;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Transactional
class DiaryServiceTest {
    @InjectMocks
    private DiaryService diaryService;

    @Mock
    private DiaryRepository diaryRepository;

    @Mock
    private ValidateUserService validateUserService;
    @Mock
    private ImageRepository imageRepository;
    @Mock
    private S3Client s3Client;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void bookmarkDiary() {
        //given
        User user = User.create("a@gmail.com","test", SocialCode.KAKAO );
        Artist artist = Artist.create("test1","test", Period.Contemporary, "test","test.png","example.png");
        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");

        boolean favorite=true;
        Diary testdiary = new Diary(user, emotion,artist, LocalDate.now(), "test", favorite,null);

        //when
        when(diaryRepository.findByDiaryId(1L)).thenReturn(Optional.of(testdiary));
        when(diaryRepository.save(any(Diary.class))).thenReturn(testdiary);

        BookmarkDiaryResponse response = diaryService.bookmarkDiary(1L, favorite);
        //then
        assertNotNull(response);
        assertEquals(response.getDiaryId(), testdiary.getDiaryId());
        assertTrue(response.isFavorite());

        verify(diaryRepository).findByDiaryId(1L);
        verify(diaryRepository, times(1)).save(testdiary);
    }

    @Test
    void BookmarkDiary_DiaryNotFound(){
        // given
        User user = User.create("a@gmail.com","test", SocialCode.KAKAO );
        Artist artist = Artist.create("test1","test", Period.Contemporary, "test","test.png","example.png");
        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");

        boolean favorite=true;
        Diary testdiary = new Diary(user, emotion,artist, LocalDate.now(), "test", favorite,null);
        testdiary.setDiaryId(1L);

        //when
        when(diaryRepository.findByDiaryId(testdiary.getDiaryId())).thenReturn(Optional.empty()); // 없을 경우를 가정


        //then
        assertThrows(DiaryNotFoundException.class, () -> diaryService.bookmarkDiary(testdiary.getDiaryId(), favorite));

        verify(diaryRepository, times(1)).findByDiaryId(testdiary.getDiaryId());
        verify(diaryRepository, times(0)).save(any(Diary.class));
    }

    @Test
    void deleteBookmarkDiary() {
        List<Long> diaryIdList = Arrays.asList(1L, 2L, 3L);
        User user = User.create("a@gmail.com","test", SocialCode.KAKAO );
        Artist artist = Artist.create("test1","test", Period.Contemporary, "test","test.png","example.png");
        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");

        boolean favorite=true;
        Diary diary1 = new Diary(user, emotion,artist, LocalDate.now(), "test1", favorite,null);
        Diary diary2 = new Diary(user, emotion,artist, LocalDate.now(), "test2", favorite,null);
        Diary diary3 = new Diary(user, emotion,artist, LocalDate.now(), "test3", favorite,null);



        List<Diary> diaries = Arrays.asList(diary1, diary2, diary3);

        when(diaryRepository.findAllById(diaryIdList)).thenReturn(diaries);
        when(diaryRepository.saveAll(anyList())).thenReturn(diaries);

        List<BookmarkDiaryResponse> response = diaryService.deleteBookmarkDiary(diaryIdList);

        assertNotNull(response);
        assertEquals(3, response.size());// 해제한 갯수 3개
        assertFalse(response.get(0).isFavorite());// 즐겨찾기 해제
        assertFalse(response.get(1).isFavorite());// 즐겨찾기 해제
        assertFalse(response.get(2).isFavorite());// 즐겨찾기 해제

        verify(diaryRepository, times(1)).findAllById(diaryIdList);
        verify(diaryRepository, times(1)).saveAll(diaries);
    }

    @Test
    void getDiaryDetailExistingDiary(){
        //given
        long diaryId = 1L;
        User user = User.create("a@gmail.com","test", SocialCode.KAKAO );
        Artist artist = Artist.create("test1","test", Period.Contemporary, "test","test.png","example.png");
        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");


        boolean favorite=true;
        Diary mockDiary = new Diary(user, emotion,artist, LocalDate.now(), "test1", favorite,null);

        Image image = new Image(mockDiary,"test.png");
        mockDiary.setImage(image);

        // when
        when(diaryRepository.findByDiaryIdWithDetails(diaryId)).thenReturn(Optional.of(mockDiary));

        DiaryDetailResponse diaryDetail = diaryService.getDiaryDetail(diaryId);

        // then
        assertNotNull(diaryDetail);
        assertEquals(mockDiary.getDiaryDate().toString(), diaryDetail.getDiaryDate());
        assertEquals(mockDiary.isFavorite(), diaryDetail.isFavorite());
        assertEquals(mockDiary.getContent(), diaryDetail.getContent());
        assertEquals(mockDiary.getEmotion().getEmotionName(), diaryDetail.getEmotionName());
        assertEquals(mockDiary.getEmotion().getEmotionPicture(), diaryDetail.getEmotionPicture());
        assertEquals(mockDiary.getArtist().getArtistName(), diaryDetail.getArtistName());
        assertEquals(mockDiary.getArtist().getArtistPicture(), diaryDetail.getArtistPicture());

        verify(diaryRepository, times(1)).findByDiaryIdWithDetails(diaryId);
    }



    @Test
    void deleteDiaryTest() {
        // given
        long diaryId = 1L;
        long userId = 1L;
        User user = User.create("a@gmail.com", "test", SocialCode.KAKAO);
        Artist artist = Artist.create("test1", "test", Period.Contemporary, "test", "test.png", "example.png");
        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");
        boolean favorite = true;

        Diary mockDiary = new Diary(user, emotion, artist, LocalDate.now(), "test1", favorite, null);
        Image image = new Image(mockDiary, "test.png");
        mockDiary.setImage(image);

        when(diaryRepository.findByDiaryId(diaryId)).thenReturn(Optional.of(mockDiary));
        when(validateUserService.validateUserById(userId)).thenReturn(user);

        // when
        diaryService.deleteDiary(diaryId, userId);

        // then
        verify(s3Client).deleteObject(any(DeleteObjectRequest.class));
        assertNotNull(mockDiary.getDeletedAt()); // Soft delete 확인
        verify(imageRepository).delete(image);
    }

    @Test
    void getBookmarkListTest() {
        // Given
        User user = User.create("a@gmail.com", "test", SocialCode.KAKAO);

        Artist artist = Artist.create("test1", "test", Period.Contemporary, "test", "test.png", "example.png");

        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");

        Diary diary1 = new Diary(user, emotion, artist, LocalDate.now(), "test1", true, null);
        Diary diary2 = new Diary(user, emotion, artist, LocalDate.now(), "test2", true, null);
        Diary diary3 = new Diary(user, emotion, artist, LocalDate.now(), "test3", true, null);
        List<Diary> diaries = Arrays.asList(diary1, diary2, diary3);

        Image image1 = new Image(diary1, "test1.png");
        Image image2 = new Image(diary2, "test2.png");
        Image image3 = new Image(diary3, "test3.png");

        diary1.setImage(image1);
        diary2.setImage(image2);
        diary3.setImage(image3);

        when(diaryRepository.findByUserIdAndFavorite(user.getUserId(),true)).thenReturn(diaries);

        // When
        List<AlbumResponse> bookmarkList = diaryService.getBookmarkList(user.getUserId());

        // Then
        assertNotNull(bookmarkList);
        assertEquals(3, bookmarkList.size());

        for (int i = 0; i < bookmarkList.size(); i++) {
            AlbumResponse response = bookmarkList.get(i);
            assertEquals("test" + (i + 1), response.getContent());
            assertEquals("test" + (i + 1) + ".png", response.getImageUrl());
        }

        verify(diaryRepository, times(1)).findByUserIdAndFavorite(user.getUserId(),true);
    }

    @Test
    void getDiaryListTest() {
        // Given
        User user = User.create("a@gmail.com", "test", SocialCode.KAKAO);

        Artist artist = Artist.create("test1", "test", Period.Contemporary, "test", "test.png", "example.png");

        Emotion emotion = Emotion.create("test", "testPrompt", "test.png");

        Diary diary1 = new Diary(user, emotion, artist, LocalDate.now(), "test1", true, null);
        Diary diary2 = new Diary(user, emotion, artist, LocalDate.now(), "test2", true, null);
        Diary diary3 = new Diary(user, emotion, artist, LocalDate.now(), "test3", true, null);
        List<Diary> diaries = Arrays.asList(diary1, diary2, diary3);

        Image image1 = new Image(diary1, "test1.png");
        Image image2 = new Image(diary2, "test2.png");
        Image image3 = new Image(diary3, "test3.png");

        diary1.setImage(image1);
        diary2.setImage(image2);
        diary3.setImage(image3);

        when(validateUserService.validateUserById(user.getUserId())).thenReturn(user);
        when(diaryRepository.findAllByUser(user)).thenReturn(diaries);

        // When
        List<DiaryListResponse> diaryList = diaryService.getDiaryList(user.getUserId());

        // Then
        assertNotNull(diaryList);
        assertEquals(3, diaryList.size());

        verify(diaryRepository, times(1)).findAllByUser(user);
    }



}