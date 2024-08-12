import React, {useState, useReducer, forwardRef} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import CheckBottomSheet from './bottomsheet/CheckBottomSheet';
import ShareModal from './bottomsheet/ShareBottomSheet';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => 100 * props.theme.widthRatio}px;
`;

const Img = styled.img`
  height: ${props => 33 * props.theme.widthRatio}px;
  padding-left: ${props => 34 * props.theme.widthRatio}px;
  padding-top: ${props => 33.5 * props.theme.widthRatio}px;
  padding-right: ${props => 34 * props.theme.widthRatio}px;
  padding-bottom: ${props => 33.5 * props.theme.widthRatio}px;
`;

const Div = styled.div`
  display: flex;
`;

const DetailHeader = forwardRef(({mainRef, data}, ref) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const handleClose = () => {
    if (window.history.length > 1) {
      // 뒤로 가기가 가능하면 navigate(-1)
      navigate(-1);
    } else {
      // 그렇지 않으면 React Native WebView로 메시지를 보냄
      window.ReactNativeWebView.postMessage('closeWebView');
    }
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  const closeShareModal = () => {
    setOpenShareModal(false);
  };

  return (
    <Header>
      <Img src='/btn_prev.png' alt='뒤로가기' onClick={handleClose} />
      <Div>
        <Img
          src='/share.png'
          alt='공유하기'
          onClick={() => {
            setOpenShareModal(true);
          }}
        />
        <Img
          src='/kebap.png'
          alt='더보기'
          onClick={() => {
            setOpenModal(true);
          }}
        />
        {openModal && <CheckBottomSheet isOpen={openModal} isClose={closeModal} />}
        {openShareModal && (
          <ShareModal mainRef={ref} data={data} isOpen={openShareModal} isClose={closeShareModal} />
        )}
      </Div>
    </Header>
  );
});

export default DetailHeader;
