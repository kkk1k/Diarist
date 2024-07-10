import React from 'react';
import styled from 'styled-components';

const ThumbnailImage = styled.img`
  width: ${props => 180 * props.theme.widthRatio}px;
  height: ${props => 180 * props.theme.widthRatio}px;
  border-radius: ${props => 10 * props.theme.widthRatio}px;
  opacity: ${props => (props.isSelectionMode && props.isSelected ? 0.5 : 1)};
`;

const CheckImage = styled.img`
  width: ${props => 35 * props.theme.widthRatio}px;
  height: ${props => 35 * props.theme.widthRatio}px;
  position: absolute;
  top: ${props => 10 * props.theme.widthRatio}px;
  left: ${props => 10 * props.theme.widthRatio}px;
  z-index: 1;
  border-radius: ${props => 10 * props.theme.widthRatio}px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

function ThumbnailAlbum({src, id, altText, isSelected, isSelectionMode, onClick}) {
  return (
    <li>
      <button type='button' onClick={() => onClick(id)} aria-label={`Thumbnail ${id}`}>
        <ImageContainer>
          <ThumbnailImage
            src={src}
            alt={altText || `Thumbnail image ${id}`}
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
          />
          {isSelected && isSelectionMode && <CheckImage src='CheckBox.png' alt='체크박스' />}
        </ImageContainer>
      </button>
    </li>
  );
}

export default ThumbnailAlbum;
