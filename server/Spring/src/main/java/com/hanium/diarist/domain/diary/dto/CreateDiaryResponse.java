package com.hanium.diarist.domain.diary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Schema(description = "일기 생성 요청")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CreateDiaryResponse {

    private String emotionName;
    private String emotionPicture;
    private String content;
    private String artistName;
    private String artistPicture;
    private String diaryDate;
    private String ImageUrl;

    @Override
    public String toString() {
        return "CreateDiaryResponse{" +
                "emotionName='" + emotionName + '\'' +
                ", emotionPicture='" + emotionPicture + '\'' +
                ", content='" + content + '\'' +
                ", artistName='" + artistName + '\'' +
                ", artistPicture='" + artistPicture + '\'' +
                ", diaryDate=" + diaryDate +
                ", ImageUrl=" + ImageUrl +
                '}';
    }
}
