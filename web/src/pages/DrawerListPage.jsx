import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import CategoryButton from '../components/CategoryButton';
import DrawerBottomSheet from '../components/bottomsheet/DrawerBottomSheet';
import useApi from '../hooks/useApi';
import {useAuth} from '../context/AuthContext';

const A11yHidden = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const H2 = styled.h2`
  text-align: left;
  font-size: ${props => 42 * props.theme.widthRatio}px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: ${props => -0.63 * props.theme.widthRatio}px;
  margin-left: ${props => 30 * props.theme.widthRatio}px;
  margin-right: ${props => 30 * props.theme.widthRatio}px;
  margin-top: ${props => 30 * props.theme.widthRatio}px;
  word-break: keep-all;
`;

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  margin-top: ${props => 30 * props.theme.widthRatio}px;
`;

const DrawerWrapper = styled.div`
  display: flex;
  height: calc(100vh - ${props => 350 * props.theme.widthRatio}px);
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Figure = styled.figure`
  margin-top: ${props => 30 * props.theme.widthRatio}px;
  width: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Figcaption = styled.figcaption`
  text-align: center;
  font-size: ${props => 26 * props.theme.widthRatio}px;
  font-weight: 400;
  line-height: normal;
  margin-top: ${props => 10 * props.theme.widthRatio}px;
`;

const DrawerImg = styled.img`
  width: 80%;
  height: auto;
`;

function DrawerListPage() {
  const {setAuth} = useAuth();
  const {AxiosApi} = useApi();
  const [data, setData] = useState([]);
  const [selectCategory, setSelectCategory] = useState('르네상스');
  const [selectDrawer, setSelectDrawer] = useState('');
  const categoryArr = ['르네상스', '근대', '현대', '기타'];
  const [openModal, setOpenModal] = useState(false);
  const handleModal = item => {
    setSelectDrawer(item);
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  const categoryMap = {
    르네상스: 'RENAISSANCE',
    근대: 'MODERN',
    현대: 'CONTEMPORARY',
    기타: 'ANIMATION',
  };
  // const data = [
  //   {
  //     artistName: '존 윌리엄',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  //   {
  //     artistName: '존 윌리엄 워',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  //   {
  //     artistName: '존 윌리엄 워터',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  //   {
  //     artistName: '존 윌리엄 워터하',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  //   {
  //     artistName: '존 윌리엄 워터하우',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  //   {
  //     artistName: '존 윌리엄 워터하우스',
  //     artistPicture: '/drawer.jpg',
  //     description: '화가 설명 ~~~~~~입니다',
  //   },
  // ];
  const fetchData = async category => {
    try {
      const response = await AxiosApi('get', `/api/v1/artist/list?period=${category}`);
      console.log('응답', response);
      setData(response.data);
    } catch (e) {
      console.log('에러', e);
    }
  };
  const handleCategory = e => {
    setSelectCategory(e.target.innerText);
    const englishCategory = categoryMap[e.target.innerText];
    fetchData(englishCategory);
  };

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

  useEffect(() => {
    fetchData('RENAISSANCE');
  }, []);

  return (
    <>
      <A11yHidden>화가리스트 페이지</A11yHidden>
      <H2>화가 리스트</H2>
      <div>
        <Div className='flex justify-between'>
          {categoryArr.map(category => (
            <CategoryButton
              key={category}
              isActive={selectCategory === category}
              label={category}
              onClick={e => {
                handleCategory(e);
              }}
            />
          ))}
        </Div>
        <DrawerWrapper>
          {data.map(item => (
            <Figure key={item.artistName}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <DrawerImg src={item.artistPicture} onClick={() => handleModal(item)} />
              <Figcaption>{item.artistName}</Figcaption>
            </Figure>
          ))}
        </DrawerWrapper>
      </div>
      {openModal && (
        <DrawerBottomSheet data={selectDrawer} isOpen={openModal} isClose={closeModal} />
      )}
    </>
  );
}

export default DrawerListPage;
