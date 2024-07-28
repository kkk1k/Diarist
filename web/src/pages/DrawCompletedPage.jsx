import React, {useEffect, useReducer, useState} from 'react';
import styled from 'styled-components';
import {EventSourcePolyfill} from 'event-source-polyfill';
import CompleteButton from '../components/CompleteButton';
import ResetModal from '../components/ResetModal';
import {useAuth} from '../context/AuthContext';

const Main = styled.div`
  margin-left: ${props => 30 * props.theme.widthRatio}px;
  margin-right: ${props => 30 * props.theme.widthRatio}px;
`;

const AccessibilityHidden = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const Div = styled.div`
  margin-top: ${props => props.$mt * props.theme.widthRatio}px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: ${props => (props.$justify ? props.$justify : 'center')};
  gap: ${props => props.$gap * props.theme.widthRatio}px;
`;

const H2Container = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const StyledH2 = styled.h2`
  font-size: ${props => 42 * props.theme.widthRatio}px;
  letter-spacing: -0.63px;
  font-weight: 500;
`;

const Button = styled.button`
  position: absolute;
  right: 0;
  border: none;
  background-color: transparent;
`;

const IconImg = styled.img`
  width: ${props => props.$width * props.theme.widthRatio}px;
  border-radius: ${props => (props.$radius ? props.$radius : '')};
  transform: rotate(${({$isOpened}) => ($isOpened === true ? '180deg' : '0deg')});
  transition: transform 0.5s ease;
`;

const PaintingImg = styled.img`
  width: ${props => 515 * props.theme.widthRatio}px;
  border-radius: 5%;
  flex-shrink: 0;
`;

const Span = styled.span`
  color: #666;
  text-align: center;
  font-size: ${props => 26 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: ${props => -0.39 * props.theme.widthRatio}px;
`;

const Figure = styled.figure`
  gap: ${props => props.$gap * props.theme.widthRatio}px;
  display: flex;
  align-items: center;
  justify-items: center;
  position: relative;
  justify-content: ${props => (props.$justify ? props.$justify : 'center')};
`;

const Figcaption = styled.figcaption`
  color: #666;
  text-align: center;
  font-size: ${props => 26 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: ${props => -0.39 * props.theme.widthRatio}px;
`;

const P = styled.p`
  font-size: ${props => 24 * props.theme.widthRatio}px;
  margin-top: ${props => props.$mt * props.theme.widthRatio}px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({$isOpened}) => ($isOpened === true ? 'none' : '3')};
  letter-spacing: -0.36px;
  line-height: ${props => 40 * props.theme.widthRatio}px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const OpenButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: ${props => 10 * props.theme.widthRatio}px;
  border: ${props => 1 * props.theme.widthRatio}px solid rgba(0, 0, 0, 0.5);
  width: ${props => 192 * props.theme.widthRatio}px;
  height: ${props => 40 * props.theme.widthRatio}px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  font-size: 50px;
`;

function DrawCompletedPage() {
  const [favorite, setFavorite] = useReducer(state => !state, false);
  const [isOpened, setIsOpened] = useReducer(state => !state, false);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {checkTokenExpiration} = useAuth();
  const [data, setData] = useState(null); // data 상태 추가

  const openModal = () => {
    setIsOpenedModal(true);
  };

  const closeModal = () => {
    setIsOpenedModal(false);
  };
  const handleCheck = () => {
    (window.ReactNativeWebView || window).postMessage('check');
  };

  useEffect(() => {
    async function fetchData() {
      const token = JSON.parse(await checkTokenExpiration());
      console.log('카프카 ', token);
      const url = `${import.meta.env.VITE_API_URL}/api/v1/diary/kafka-response`;

      console.log('EventSource URL:', url);

      const eventSource = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 120000, // 60초로 타임아웃 설정
      });

      eventSource.onmessage = event => {
        const jsonData = JSON.parse(event.data);
        console.log(jsonData);
        setData(jsonData);
        setLoading(false);
      };

      eventSource.onerror = error => {
        console.log('EventSource failed:', error);
        eventSource.close();
        setLoading(false);
      };

      return () => {
        eventSource.close();
      };
    }
    fetchData();
  }, []);

  return loading ? (
    <Loading>Loading</Loading>
  ) : data ? (
    <Main>
      <AccessibilityHidden>그림 완성 페이지</AccessibilityHidden>
      <Div $mt='100'>
        <H2Container>
          <StyledH2>{data.diaryDate}</StyledH2>
        </H2Container>
        <Button type='button' aria-label='즐겨찾기'>
          {favorite ? (
            <IconImg
              onClick={setFavorite}
              $width='50'
              src='/fullStar.png'
              alt='합쳐진 즐겨찾기 버튼'
            />
          ) : (
            <IconImg onClick={setFavorite} $width='50' src='/star.png' alt='즐겨찾기 버튼' />
          )}
        </Button>
      </Div>
      <Div $mt='38'>
        <PaintingImg src={data.imageUrl} alt='완성된 그림' />
      </Div>
      <Div $mt='38' $justify='space-evenly'>
        <Div $gap='10'>
          <IconImg $width='83' $radius='100%' src={data.emotionPicture} alt='감정 이미지' />
          <Span>{data.emotionName}</Span>
        </Div>
        <Figure $gap='10'>
          <IconImg $width='83' $radius='100%' src={data.artistPicture} alt='아티스트 이미지' />
          <Figcaption>{data.artistName}</Figcaption>
        </Figure>
      </Div>
      <P $isOpened={isOpened} $mt='38'>
        {data.content}
      </P>
      <Div $mt='38'>
        <OpenButton type='button' aria-label='더보기' onClick={setIsOpened}>
          <IconImg $isOpened={isOpened} $width='30' src='/prev.png' alt='더보기 버튼' />
        </OpenButton>
      </Div>
      <CompleteButton handleCheck={handleCheck} handleRedraw={openModal} />
      {isOpenedModal && <ResetModal isOpen={isOpenedModal} closeModal={closeModal} />}
    </Main>
  ) : (
    <div>데이터를 불러오지 못했습니다.</div>
  );
}

export default DrawCompletedPage;
