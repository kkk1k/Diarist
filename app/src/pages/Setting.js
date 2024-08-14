import React, {useState} from 'react';
import {Switch, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const MainContainer = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const HeaderContainer = styled.View`
  padding: 20px;
  position: relative;
`;

const CloseButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
`;

const CloseImage = styled.Image`
  width: 20px;
  height: 20px;
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 0 30px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SettingText = styled.Text`
  color: #666;
`;

const BottomContainer = styled.View`
  padding: 20px 30px;
`;

const BottomRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const BottomTitle = styled.Text`
  font-size: 16px;
  color: #666;
`;

function Setting({navigation}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = () => {
    setNotificationsEnabled(previousState => !previousState);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <MainContainer>
        <HeaderContainer>
          <CloseButtonContainer onPress={handleClose}>
            <CloseImage source={require('../assets/btn_x.png')} />
          </CloseButtonContainer>
        </HeaderContainer>
        <ContentContainer>
          <Section>
            <SectionTitle>서비스 소개</SectionTitle>
            <SettingText>Diarist 100% 활용법을 알려드릴게요!</SettingText>
          </Section>
          <Section>
            <SectionTitle>문의하기</SectionTitle>
            <SettingText>문의사항이 있다면 편하게 남겨주세요!</SettingText>
          </Section>
          <Section>
            <SettingRow>
              <SectionTitle>일기 알림</SectionTitle>
              <Switch onValueChange={toggleNotifications} value={notificationsEnabled} />
            </SettingRow>
            <SettingText>오늘 일기를 작성하지 않았다면 20시에 알람이 가요!</SettingText>
          </Section>
          <Section>
            <SectionTitle>리뷰</SectionTitle>
            <SettingText>별 5개 부탁드려요!</SettingText>
          </Section>
          <Section>
            <SectionTitle>친구에게 알려주기</SectionTitle>
            <SettingText>친구랑 같이 일기를 써보는건 어떨까요?</SettingText>
          </Section>
        </ContentContainer>
        <BottomContainer>
          <BottomRow>
            <TouchableOpacity>
              <BottomTitle>로그아웃</BottomTitle>
            </TouchableOpacity>
            <TouchableOpacity>
              <BottomTitle>서비스 탈퇴</BottomTitle>
            </TouchableOpacity>
          </BottomRow>
        </BottomContainer>
      </MainContainer>
    </SafeAreaWrapper>
  );
}

export default Setting;
