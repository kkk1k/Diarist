package com.hanium.diarist.common.resolver;

import io.swagger.v3.oas.annotations.Parameter;

import java.lang.annotation.ElementType;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)// 런타임동안 유지
@Parameter(hidden = true)// swagger에서 보이지 않게 설정
public @interface AuthUser {
}
