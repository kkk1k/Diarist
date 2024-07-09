package com.hanium.diarist.domain.artist.dto;

import com.hanium.diarist.domain.artist.domain.Artist;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ArtistResponse {

    private final String artistName;
    private final String artistPicture;
    private final String description;

    public static ArtistResponse of(Artist artist) {
        return new ArtistResponse(artist.getArtistName(), artist.getArtistPicture(), artist.getDescription());
    }


}
