package com.hanium.diarist.domain.artist.domain;

public enum Period {
    RENAISSANCE("르네상스"),MODERN("근대"),CONTEMPORARY("현대"),ANIMATION("만화");
    private String keyword;

    Period(String keyword) {
        this.keyword = keyword;
    }

    public String getKeyword() {
        return keyword;
    }
}
