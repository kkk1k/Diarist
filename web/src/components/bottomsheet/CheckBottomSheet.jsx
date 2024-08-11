import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
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
  width: ${props => 32 * props.theme.widthRatio}px;
`;

const Svg = styled.svg`
  width: ${props => 32 * props.theme.widthRatio}px;
`;
const P = styled.p`
  color: ${props => (props.$col ? props.$col : '000')};
  text-align: center;
  font-size: ${props => 32 * props.theme.widthRatio}px;
  line-height: ${props => 36 * props.theme.widthRatio}px;
  letter-spacing: ${props => -0.36 * props.theme.widthRatio}px;
  font-weight: 500;
  word-break: keep-all;
`;

const BottomSheetContent = styled.div`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const ImgWrapper = styled.div`
  margin-bottom: ${props => 40 * props.theme.widthRatio}px;
`;
const Div = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: ${props => 40 * props.theme.widthRatio}px;
  gap: ${props => 20 * props.theme.widthRatio}px;
`;
function CheckBottomSheet({isOpen, isClose}) {
  const {isOpen: sheetIsOpen, openBottomSheet, closeBottomSheet, refs} = useBottomSheet(isClose);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (isOpen) {
      openBottomSheet();
    } else {
      closeBottomSheet();
      isClose();
    }
  }, [isOpen, openBottomSheet, closeBottomSheet]);
  const closeModal = () => {
    setOpenModal(false);
  };
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
            <Div>
              {' '}
              <Img src='/edit.png' />
              <P>수정하기</P>
            </Div>
            <Div
              onClick={() => {
                setOpenModal(true);
              }}
            >
              {' '}
              <Svg
                width='30px'
                height='30px'
                viewBox='3 3 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10 12V17'
                  stroke='#ff0000'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M14 12V17'
                  stroke='#ff0000'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4 7H20'
                  stroke='#ff0000'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10'
                  stroke='#ff0000'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z'
                  stroke='#ff0000'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </Svg>
              <P $col='#ff0000'>삭제하기</P>
              {openModal && <DeleteModal isOpen={openModal} closeModal={closeModal} />}
            </Div>
          </ImgWrapper>
        </BottomSheetContent>
      </Wrapper>
    </BottomSheetBackground>,
    document.getElementById('modal-root'),
  );
}

export default CheckBottomSheet;
