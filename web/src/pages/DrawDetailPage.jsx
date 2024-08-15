import React, {useState, useEffect, useRef, useReducer} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useAuth} from '../context/AuthContext';
import {useDiary} from '../context/DiaryContext';
import useApi from '../hooks/useApi';
import DetailHeader from '../components/DetailHeader';
import useDebounce from '../hooks/useDebounce';

const Main = styled.div`
  margin-left: ${props => 30 * props.theme.widthRatio}px;
  margin-right: ${props => 30 * props.theme.widthRatio}px;
`;

const Card = styled.div`
  margin-top: ${props => 38 * props.theme.widthRatio}px;
  padding-top: ${props => 38 * props.theme.widthRatio}px;
  padding-bottom: ${props => 38 * props.theme.widthRatio}px;
  border-radius: 5%;
  padding-left: ${props => 15 * props.theme.widthRatio}px;
  padding-right: ${props => 15 * props.theme.widthRatio}px;
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
  right: 10px;
  border: none;
  background-color: transparent;
`;

const IconImg = styled.img`
  width: ${props => props.$width * props.theme.widthRatio}px;
  height: ${props => props.$width * props.theme.widthRatio}px;
  border-radius: ${props => (props.$radius ? props.$radius : '')};
  transform: rotate(${({$isOpened}) => ($isOpened === true ? '180deg' : '0deg')});
  transition: transform 0.5s ease;
`;

const PaintingImg = styled.img`
  width: 100%;
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
  margin-bottom: ${props => props.$mb * props.theme.widthRatio}px;
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

const ShareButton = styled.button``;

function DrawDetailPage() {
  const mainRef = useRef(null);
  const {AxiosApi} = useApi();
  const [favorite, setFavorite] = useState(false);
  const [initialFavorite, setInitialFavorite] = useState(false);
  const [isOpened, setIsOpened] = useReducer(state => !state, false);
  const [isToken, setIsToken] = useState(false);
  const [isShowPlusButton, setIsShowPlusButton] = useState(false);
  const {setAuth} = useAuth();
  const {setSelectedEmotion, setDiaryContent, setDiaryDate} = useDiary();
  const [data, setData] = useState([]);
  const {id} = useParams();
  const numberId = parseInt(id, 10);
  const debounceFavorite = useDebounce(favorite, 500);

  useEffect(() => {
    const handleMessage = event => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'tokens' && message.accessToken && message.refreshToken) {
          setAuth({
            accessToken: message.accessToken,
            refreshToken: message.refreshToken,
          });
        }
        setIsToken(true);
      } catch (error) {
        console.log('Error parsing message:', error);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  // const data = {
  //   diaryDate: '2024-07-15',
  //   favorite: false,
  //   imageUrl: '/s3-bucket/img/e46e0406498611efb86f0242ac110002',
  //   emotionName: '행복',
  //   emotionPicture: '/r2/emotions/001.png', // R2에 대한 프록시 경로로 수정
  //   artistName: '레오나르도 다빈치',
  //   artistPicture: '/r2/artists/davinci.webp', // R2에 대한 프록시 경로로 수정
  //   content: '테스트용 데이터!!!!!!!!!',
  // };

  const fetchData = async () => {
    try {
      const response = await AxiosApi('get', `/api/v1/diary/detail/${id}`);
      const modifiedData = {
        ...response.data,
        imageUrl: `/s3-bucket/img/${response.data.imageUrl.split('/').pop()}`,
        emotionPicture: `/r2/emotions/${response.data.emotionPicture.split('/').pop()}`,
        artistPicture: `/r2/artists/${response.data.artistPicture.split('/').pop()}`,
      };
      setData(modifiedData);
      setDiaryDate(response.data.diaryDate);
      setDiaryContent(response.data.content);
      setSelectedEmotion(response.data.emotionName);
      setFavorite(response.data.favorite);
      setInitialFavorite(response.data.favorite);
      console.log('fetchData response data:', response.data);
      if (response.data.content.length > 30) {
        setIsShowPlusButton(true);
      }
    } catch (e) {
      console.error('fetchData error:', e);
    }
  };

  const updateFavoriteStatus = async () => {
    try {
      await AxiosApi('post', '/api/v1/diary/bookmark', {
        diaryId: numberId,
        favorite,
      });
      console.log('Favorite status updated successfully');
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  const handleFavoriteClick = () => {
    setFavorite(prev => !prev);
  };

  useEffect(() => {
    if (isToken) {
      fetchData();
    }
  }, [isToken]);

  useEffect(() => {
    if (initialFavorite !== debounceFavorite) {
      // Listen to debounce value
      updateFavoriteStatus();
    }
  }, [debounceFavorite, initialFavorite]);

  return (
    <>
      <DetailHeader data={data} ref={mainRef} />
      <Main>
        <AccessibilityHidden>그림 완성 페이지 </AccessibilityHidden>
        <Card ref={mainRef}>
          <Div>
            <H2Container>
              {data.diaryDate && (
                <StyledH2>
                  {data.diaryDate.slice(0, 4)}년 {data.diaryDate.slice(5, 7)}월{' '}
                  {data.diaryDate.slice(8, 10)}일
                </StyledH2>
              )}
            </H2Container>
            <Button type='button' aria-label='즐겨찾기' onClick={handleFavoriteClick}>
              {favorite ? (
                <IconImg $width='50' src='/fullStar.png' alt='채워진 즐겨찾기 버튼' />
              ) : (
                <IconImg $width='50' src='/star.png' alt='즐겨찾기 버튼' />
              )}
            </Button>
          </Div>
          <Div $mt='38'>
            <PaintingImg src={data.imageUrl} alt='완성된 그림' />
          </Div>
          <Div $mt='38' $justify='space-evenly'>
            <Div $gap='10'>
              <IconImg $width='83' src={data.emotionPicture} />
              <Span>{data.emotionName}</Span>
            </Div>
            <Figure $gap='10'>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <IconImg $width='83' $radius='100%' src={data.artistPicture} />
              <Figcaption>{data.artistName}</Figcaption>
            </Figure>
          </Div>

          <P $isOpened={isOpened} $mt='38' $mb='38'>
            {data.content}
          </P>
        </Card>
        {isShowPlusButton && (
          <Div>
            <OpenButton type='button' aria-label='더보기' onClick={setIsOpened}>
              <IconImg $isOpened={isOpened} $width='30' src='/prev.png' alt='더보기 버튼' />
            </OpenButton>
          </Div>
        )}
      </Main>
    </>
  );
}

export default DrawDetailPage;
