import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import BottomSheetHeader from './BottomSheetHeader';
import useBottomSheet from '../../hooks/useBottomSheet';
import DeleteModal from '../DeleteModal';

const BottomSheetBackground = styled.section`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 30px 30px 0 0;
  padding-left: ${props => 70 * props.theme.widthRatio}px;
  padding-right: ${props => 70 * props.theme.widthRatio}px;
  transition: transform 150ms ease-out;
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(100%)')};
`;

const Img = styled.img`
  width: ${props => 100 * props.theme.widthRatio}px;
  border-radius: 30%;
`;

const PlusImg = styled.img`
  width: ${props => 100 * props.theme.widthRatio}px;
  border-radius: 20%;
`;

const BottomSheetContent = styled.div`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${props => 40 * props.theme.widthRatio}px;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => 20 * props.theme.widthRatio}px;
`;
function ShareBottomSheet({mainRef, data, isOpen, isClose}) {
  const {isOpen: sheetIsOpen, openBottomSheet, closeBottomSheet, refs} = useBottomSheet(isClose);

  const {id} = useParams();
  const shareKakao = () => {
    console.log('click kakao');
    if (window.Kakao) {
      try {
        window.Kakao.Share.sendCustom({
          templateId: 110736,
          templateArgs: {
            TITLE: data.diaryDate,
            DESCRIPTION: data.content,
            THU: data.imageUrl,
            id,
          },
        });
      } catch (error) {
        console.error('Error sending Kakao link:', error);
      }
    } else {
      console.log('Kakao does not exist');
    }
  };

  const captureAndShare = async () => {
    console.log('hello');

    try {
      // 즐겨찾기 버튼 요소를 찾습니다.
      const favoriteButton = mainRef.current.querySelector('button[aria-label="즐겨찾기"]');

      // 부모 요소를 기억해둡니다.
      const parent = favoriteButton?.parentNode;

      // 캡처 전에 즐겨찾기 버튼을 DOM에서 제거합니다.
      if (favoriteButton && parent) {
        parent.removeChild(favoriteButton);
      }
      const canvas = await html2canvas(mainRef.current);
      const imageData = canvas.toDataURL('image/png');
      // 캡처 후 즐겨찾기 버튼을 다시 DOM에 추가합니다.
      if (favoriteButton && parent) {
        parent.appendChild(favoriteButton);
      }

      // 여기서 postMessage를 사용하여 이미지 데이터를 웹뷰로 전송
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'capturedImage',
          data: imageData,
        }),
      );
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_KEY);
        console.log('Kakao initialized');
      } else {
        console.log('Kakao already initialized');
      }
    } else {
      console.log('Kakao not loaded');
    }
  }, []);
  useEffect(() => {
    if (isOpen) {
      openBottomSheet();
    } else {
      closeBottomSheet();
      isClose();
    }
  }, [isOpen, openBottomSheet, closeBottomSheet]);
  return ReactDOM.createPortal(
    <BottomSheetBackground onClick={isClose}>
      <Wrapper
        ref={refs.sheet}
        $isOpen={sheetIsOpen}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <BottomSheetHeader />
        <BottomSheetContent ref={refs.content}>
          <ImgWrapper>
            <IconWrapper onClick={shareKakao}>
              <Img src='/kakao.webp' />
              <p>카카오톡 </p>
            </IconWrapper>
            <IconWrapper onClick={captureAndShare}>
              <PlusImg src='/plus.png' />
              <p>더보기 </p>
            </IconWrapper>
          </ImgWrapper>
        </BottomSheetContent>
      </Wrapper>
    </BottomSheetBackground>,
    document.getElementById('modal-root'),
  );
}

export default ShareBottomSheet;
