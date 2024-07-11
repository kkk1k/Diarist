package com.hanium.diarist.domain.diary.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AlbumResponse {

    private Long diaryId;
    private String diaryDate;// 일기 날짜
    private String content;// 일기 내용
    private String emotion;// 감정
    private String artist;// 화가
    private String imageUrl;// 이미지


}
