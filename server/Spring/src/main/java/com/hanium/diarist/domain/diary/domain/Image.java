package com.hanium.diarist.domain.diary.domain;

import com.hanium.diarist.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @OneToOne(mappedBy = "image",fetch = FetchType.LAZY)
    private Diary diary;

    @NotNull
    @Column(nullable = false,length = 500)
    private String imageUrl;

    // 프롬프트 일단 생략


    public Image(Diary diary, String imageUrl) {
        this.diary = diary;
        this.imageUrl = imageUrl;
    }

    /*
    * @deprecated (since 2024-07-27, reason = "이미지 삭제 API로 대체")
    * */
    @Deprecated(since = "2024-07-27")
    public void deleteImage(){
        this.imageUrl = "deleted";
    }
}
