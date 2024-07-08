import React from 'react';
import styled from 'styled-components';

const ListImage = styled.img`
  width: ${props => 160 * props.theme.widthRatio}px;
  height: ${props => 160 * props.theme.widthRatio}px;
  border-radius: ${props => 10 * props.theme.widthRatio}px;
  opacity: ${props => (props.isSelectionMode && props.isSelected ? 0.5 : 1)};
`;

const ListLi = styled.li`
  display: flex;
  gap: ${props => 20 * props.theme.widthRatio}px;
  margin-bottom: ${props => 20 * props.theme.widthRatio}px;
`;

const H4 = styled.h4`
  color: #000;
  font-size: ${props => 36 * props.theme.widthRatio}px;
  font-weight: 500;
  line-height: normal;
`;

const P = styled.p`
  color: #666;
  font-size: ${props => 22 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.33px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => 10 * props.theme.widthRatio}px;
`;

const HashContainer = styled.div`
  display: flex;
  gap: ${props => 20 * props.theme.widthRatio}px;
`;

const Content = styled.p`
  margin-top: ${props => 20 * props.theme.widthRatio}px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
  font-size: ${props => 20 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: left;
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

const Button = styled.button`
  display: flex;
  background-color: transparent;
  gap: ${props => 20 * props.theme.widthRatio}px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

function ListAlbum({
  src,
  date,
  artist,
  emotion,
  content,
  id,
  onClick,
  isSelected,
  isSelectionMode,
}) {
  return (
    <ListLi>
      <Button type='button' aria-label={`Thumbnail ${id}`} onClick={() => onClick(id)}>
        <ImageContainer>
          <ListImage
            src={src}
            alt='일기'
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
          />
          {isSelected && isSelectionMode && <CheckImage src='CheckBox.png' alt='체크박스' />}
        </ImageContainer>
        <div>
          <TitleContainer>
            <H4>{date}</H4>
            <HashContainer>
              <P># {artist}</P>
              <P># {emotion}</P>
            </HashContainer>
          </TitleContainer>
          <Content>{content}</Content>
        </div>
      </Button>
    </ListLi>
  );
}

export default ListAlbum;
