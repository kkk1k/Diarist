package com.hanium.diarist.domain.artist.controller;

import com.hanium.diarist.common.response.SuccessResponse;
import com.hanium.diarist.domain.artist.domain.Period;
import com.hanium.diarist.domain.artist.dto.*;
import com.hanium.diarist.domain.artist.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/artist")
@RequiredArgsConstructor
public class ArtistController {
    private final ArtistService artistService;

    @PostMapping("/create")
    public ResponseEntity<SuccessResponse<List<CreateArtistResponse>>> createArtists(@RequestBody List<CreateArtistRequest> createArtistRequests) {
        List<CreateArtistResponse> artists = artistService.createArtists(createArtistRequests);
        return SuccessResponse.of(artists).asHttp(HttpStatus.CREATED);

    }

    @GetMapping("/list")
    public ResponseEntity<SuccessResponse<List<ArtistFilterByPeriodResponse>>> getArtistsFilterByPeriod(@RequestParam Period period) {
        List<ArtistFilterByPeriodResponse> artists = artistService.filterByPeriod(period);
        return SuccessResponse.of(artists).asHttp(HttpStatus.OK);
    }

    @GetMapping("/list/{artistId}")
    public ResponseEntity<SuccessResponse<ArtistResponse>> getArtist(@PathVariable Long artistId) {
        ArtistResponse artist = artistService.getArtist(artistId);
        return SuccessResponse.of(artist).asHttp(HttpStatus.OK);
    }

    @GetMapping("/select/{artistId}")
    public ResponseEntity<SuccessResponse<SelectArtistResponse>> selectArtist(@PathVariable Long artistId) {
        SelectArtistResponse artist = artistService.selectArtist(artistId);
        return SuccessResponse.of(artist).asHttp(HttpStatus.OK);
    }
}
