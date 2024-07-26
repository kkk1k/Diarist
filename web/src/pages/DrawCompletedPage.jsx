import React, {useEffect, useReducer, useState} from 'react';
import styled from 'styled-components';
import {EventSourcePolyfill} from 'event-source-polyfill';
import CompleteButton from '../components/CompleteButton';
import ResetModal from '../components/ResetModal';
import useApi from '../hooks/useApi';
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

const Svg = styled.svg`
  width: ${props => 83 * props.theme.widthRatio}px;
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

function DrawCompletedPage() {
  const [favorite, setFavorite] = useReducer(state => !state, false);
  const [isOpened, setIsOpened] = useReducer(state => !state, false);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {checkTokenExpiration} = useAuth();
  const [data, setData] = useState(null); // data 상태 추가
  const {AxiosApi} = useApi();

  const fetchData = async () => {
    try {
      const response = await AxiosApi('get', '/api/v1/diary/kafka-response');
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setIsOpenedModal(true);
  };

  const closeModal = () => {
    setIsOpenedModal(false);
  };
  const handleCheck = () => {
    (window.ReactNativeWebView || window).postMessage('closeWebView');
  };

  const content =
    '(엑스포츠뉴스 김환 기자) 에릭 텐 하흐 감독의 유임을 반기지 않을 다섯 명의 선수들이 있다.글로벌 스포츠 매체이자 영국 내 유력 매체인 디 애슬레틱의 데이비드 온스테인은 12일(한국시간) "텐 하흐 감독은 맨체스터 유나이티드의 감독으로 남을 것이다. 구단은 시즌이 끝난 뒤 검토를 거친 끝에 텐 하흐 감독을 유임하기로 결정했고, 텐 하흐 감독도 올드 트래퍼드에 남기로 동의했다"라고 전했다.또한 온스테인은 "맨유는 텐 하흐 감독의 미래에 대한 불확실성이 커지자 회담을 열었고, 양측 모두 텐 하흐 감독의 유임을 원했다. 텐 하흐 감독의 기존 계약은 내년 6월까지지만 12개월 연장 옵션이 포함되어 있고, 양측은 이제 계약 연장을 두고 논의에 들어갈 예정이다"라고 덧붙였다.영국 공영방송 BBC 역시 같은 날 "텐 하흐 감독이 시즌이 끝난 후 ';

  useEffect(() => {
    const token = JSON.parse(checkTokenExpiration());
    const url = `${import.meta.env.VITE_API_URL}/api/v1/diary/kafka-response`;

    console.log('EventSource URL:', url);

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    eventSource.onmessage = event => {
      const jsonData = JSON.parse(event.data);
      console.log(jsonData);
      setData(jsonData);
      setLoading(false);
    };

    eventSource.onerror = error => {
      console.error('EventSource failed:', error);
      eventSource.close();
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : (
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
          <IconImg $width='83' $radius='100%' src={data.emotionPicture} alt='피카소' />
          <Span>{data.emotionName}</Span>
        </Div>
        <Figure $gap='10'>
          <IconImg $width='83' $radius='100%' src={data.artistPicture} alt='피카소' />
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
  );
}

export default DrawCompletedPage;
