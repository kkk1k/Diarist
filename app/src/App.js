import React, {useState, useEffect} from 'react';
import {Text, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import styled, {ThemeProvider} from 'styled-components/native';
import useFonts from './hooks/useFont';
import MyStack from './MyStack';

const FIGMA_WIDTH = 640;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const [widthRatio, setWidthRatio] = useState(1);
  const fontsLoaded = useFonts();

  useEffect(() => {
    const updateWidthRatio = () => {
      const {width} = Dimensions.get('window');
      const newWidthRatio = width / FIGMA_WIDTH;
      setWidthRatio(newWidthRatio);
    };

    updateWidthRatio();
    const subscription = Dimensions.addEventListener('change', updateWidthRatio);

    return () => {
      subscription?.remove();
    };
  }, []);
  const theme = {
    widthRatio,
    backgroundColor: '#ffffff', // 배경색을 흰색으로 설정
    fontFamily: 'Pretendard-Regular', // 기본 폰트 설정
  };

  if (!fontsLoaded) {
    return (
      <LoadingContainer>
        <Text>Loading...</Text>
      </LoadingContainer>
    );
  }

  // Set default props for Text component
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = {
    ...Text.defaultProps.style,
    fontFamily: 'Pretendard-Regular',
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}
