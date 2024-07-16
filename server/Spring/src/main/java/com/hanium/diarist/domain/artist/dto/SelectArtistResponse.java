package com.hanium.diarist.domain.artist.dto;

import com.hanium.diarist.domain.artist.domain.Artist;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SelectArtistResponse {
    private final String artistName;
    private final String examplePicture;

    public static SelectArtistResponse of(Artist artist) {
        return new SelectArtistResponse(artist.getArtistName(), artist.getExamplePicture());
    }
}