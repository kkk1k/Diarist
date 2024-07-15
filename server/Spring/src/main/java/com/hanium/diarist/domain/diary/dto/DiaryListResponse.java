package com.hanium.diarist.domain.diary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryListResponse {
    private final Long diaryId;
    private final String date;
    private final String imageUrl;


}
