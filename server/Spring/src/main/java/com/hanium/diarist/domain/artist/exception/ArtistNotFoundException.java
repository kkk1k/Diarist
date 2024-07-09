package com.hanium.diarist.domain.artist.exception;

import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.common.exception.ErrorCode;

public class ArtistNotFoundException extends BusinessException {

    public ArtistNotFoundException() {
        super(ErrorCode.ARTIST_NOT_FOUND);
    }

}
