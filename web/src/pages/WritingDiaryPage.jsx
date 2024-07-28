import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import DiaryButton from '../components/DiaryButton';
import TopNavBar from '../components/TopNavBar';
import {useDiary} from '../context/DiaryContext';

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
  font-size: ${props => 42 * props.theme.widthRatio}px;
  text-align: center;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.63px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const Textarea = styled.textarea`
  width: ${props => 500 * props.theme.widthRatio}px;
  height: ${props =>
    props.isKeyboardVisible ? 180 * props.theme.widthRatio : 752 * props.theme.widthRatio}px;
  border-radius: ${props => 20 * props.theme.widthRatio}px;
  padding: ${props => 40 * props.theme.widthRatio}px;
  margin-top: ${props => 30 * props.theme.widthRatio}px;
  text-overflow: ellipsis;
  font-size: ${props => 24 * props.theme.widthRatio}px;
  font-weight: 400;
  line-height: ${props => 40 * props.theme.widthRatio}px;
  letter-spacing: -0.36px;
  transition: height 0.3s ease;
  outline: ${props => (props.isKeyboardVisible ? '1px solid #000' : '1px solid #999')};
`;

const InputP = styled.p`
  text-align: right;
  font-size: ${props => 20 * props.theme.widthRatio}px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.3px;
  margin-bottom: ${props => 30 * props.theme.widthRatio}px;
`;

const TextareaContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const Span = styled.span`
  font-size: ${props => 20 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.3px;
`;

function WritingDiaryPage() {
  const {selectedEmotion, diaryContent, setDiaryContent} = useDiary();

  const [inputCount, setInputCount] = useState(diaryContent.length);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const onInputHandler = e => {
    const inputValue = e.target.value;
    setInputCount(inputValue.length);
    setDiaryContent(inputValue);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
        setIsKeyboardVisible(window.visualViewport.height < window.outerHeight);
      }
    };

    window.visualViewport.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container style={{height: viewportHeight}}>
      <div>
        <A11yHidden>일기 작성</A11yHidden>
        <TopNavBar progress={2} />
        <H2>당신의 특별한 일상을</H2>
        <H2>기록해주세요</H2>
      </div>
      <TextareaContainer>
        <Textarea
          onChange={onInputHandler}
          value={diaryContent}
          isKeyboardVisible={isKeyboardVisible}
        />
        <InputP>
          {inputCount}
          <Span>/1000</Span>
        </InputP>
      </TextareaContainer>
      <DiaryButton
        firstLabel='초기화'
        secondLabel='작성완료'
        nextPath='selectdrawer'
        emotionId={selectedEmotion}
        content={diaryContent}
        firstDisabled={diaryContent.length === 0}
        secondDisabled={diaryContent.length === 0}
        deleteText={() => {
          setDiaryContent('');
          setInputCount(0);
        }}
      />
    </Container>
  );
}

export default WritingDiaryPage;
