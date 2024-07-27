package com.hanium.diarist.domain.artist.controller;

import com.hanium.diarist.common.response.SuccessResponse;
import com.hanium.diarist.domain.artist.domain.Period;
import com.hanium.diarist.domain.artist.dto.*;
import com.hanium.diarist.domain.artist.service.ArtistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
    @Operation(summary = "화가 추가 api", description = "화가 추가 API.")
    @ApiResponse(responseCode = "200", description = "화가 추가 완료")
    public ResponseEntity<SuccessResponse<List<CreateArtistResponse>>> createArtists(@RequestBody List<CreateArtistRequest> createArtistRequests) {
        List<CreateArtistResponse> artists = artistService.createArtists(createArtistRequests);
        return SuccessResponse.of(artists).asHttp(HttpStatus.CREATED);

    }

    @GetMapping("/list")
    @Operation(summary = "화가 리스트 api", description = "화가 리스트, 모달에서 사용될 API.시대별로 필터링된 화가 리스트 제공")
    @ApiResponse(responseCode = "200", description = "화가 리스트 제공 완료")
    public ResponseEntity<SuccessResponse<List<ArtistFilterByPeriodResponse>>> getArtistsFilterByPeriod(@RequestParam Period period) {
        List<ArtistFilterByPeriodResponse> artists = artistService.filterByPeriod(period);
        return SuccessResponse.of(artists).asHttp(HttpStatus.OK);
    }

    @GetMapping("/select")
    @Operation(summary = "화가 선택 페이지 api", description = "화가 선택, 모달에서 사용될 API. 시대별로 필터링된 화가 선택 리스트 제공")
    @ApiResponse(responseCode = "200", description = "화가 선택페이지 데이터 제공 완료")
    public ResponseEntity<SuccessResponse<List<SelectArtistResponse>>> getArtistsForSelect(@RequestParam Period period) {
        List<SelectArtistResponse> artists = artistService.selectPeriod(period);
        return SuccessResponse.of(artists).asHttp(HttpStatus.OK);
    }

    @Deprecated
    @GetMapping("/list/{artistId}")
    public ResponseEntity<SuccessResponse<ArtistResponse>> getArtist(@PathVariable Long artistId) {
        ArtistResponse artist = artistService.getArtist(artistId);
        return SuccessResponse.of(artist).asHttp(HttpStatus.OK);
    }

    @Deprecated
    @GetMapping("/select/{artistId}")
    public ResponseEntity<SuccessResponse<SelectArtistResponse>> selectArtist(@PathVariable Long artistId) {
        SelectArtistResponse artist = artistService.selectArtist(artistId);
        return SuccessResponse.of(artist).asHttp(HttpStatus.OK);
    }
}
