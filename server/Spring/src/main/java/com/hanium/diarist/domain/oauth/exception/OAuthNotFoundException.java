package com.hanium.diarist.domain.oauth.exception;


import com.hanium.diarist.common.exception.BusinessException;
import com.hanium.diarist.common.exception.ErrorCode;

public class OAuthNotFoundException extends BusinessException {
    public OAuthNotFoundException() {
        super(ErrorCode.OAUTH_NOT_FOUND);
    }

}
