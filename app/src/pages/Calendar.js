import {React, useEffect, useState, useCallback} from 'react';
import {Pressable} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import styled from 'styled-components/native';
import useApi from '../hooks/useApi';

// 한글 설정
LocaleConfig.locales.fr = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'fr';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding-top: 40px;
`;

const Header = styled.View`
  padding: 20px;
  background-color: #fff;
`;

const HeaderText = styled.Text`
  font-size: ${props => 36 * props.theme.widthRatio}px;
  font-weight: bold;
`;

const StyledCalendar = styled(Calendar)`
  border-width: 0;
  border-color: #eee;
  padding-left: 0;
  padding-right: 0;
`;

const DayContainer = styled.View`
  width: 100%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
`;

const DayText = styled.Text`
  text-align: center;
  font-size: ${props => 22 * props.theme.widthRatio}px;
  margin-bottom: 2px;
  font-weight: 300;
  color: ${props => {
    if (props.isFuture) {
      if (props.isSunday) return '#d90c0c';
      if (props.isSaturday) return '#0851c3';
      return '#000';
    }
    if (props.isSunday) return '#d90c0c';
    if (props.isSaturday) return '#0851c3';
    return '#2d4150';
  }};
  opacity: ${props => (props.isFuture ? 0.5 : 1)};
`;

const DiaryImage = styled.Image`
  width: ${props => 68 * props.theme.widthRatio}px;
  height: ${props => 68 * props.theme.widthRatio}px;
  border-radius: 10px;
  margin-top: 2px;
`;

const Placeholder = styled.View`
  width: ${props => 68 * props.theme.widthRatio}px;
  height: ${props => 68 * props.theme.widthRatio}px;
  border-radius: 10px;
  margin-top: 2px;
  background-color: #e0e0e0;
`;

const TodayPlaceholder = styled.View`
  width: ${props => 68 * props.theme.widthRatio}px;
  height: ${props => 68 * props.theme.widthRatio}px;
  border-radius: 10px;
  margin-top: 2px;
  background-color: #000;
  justify-content: center;
  align-items: center;
`;

const PlusImage = styled.Image`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 30 * props.theme.widthRatio}px;
`;

function Calendars({navigation, route}) {
  const [diaryData, setDiaryData] = useState({});
  const {data, isLoading, error, AxiosApi} = useApi();

  const fetchData = async () => {
    try {
      await AxiosApi('get', '/api/v1/diary/list');
      console.log('캘린더 접속');
    } finally {
      console.log('done');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route]),
  );

  useEffect(() => {
    if (data && data.data) {
      const formattedData = data.data.reduce((acc, diary) => {
        acc[diary.date] = diary;
        return acc;
      }, {});

      setDiaryData(formattedData);
    }
  }, [data]);

  // 현재 표시중인 월
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 월 변경시 호출되는 함수
  const onMonthChange = month => {
    setCurrentMonth(new Date(month.timestamp));
  };

  // 헤더에 표시할 날짜 형식 변경
  const formatHeaderDate = date =>
    `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;

  // 각 날짜 셀 렌더링
  const renderDay = date => {
    const diary = diaryData[date.dateString];
    const isToday = date.dateString === new Date().toISOString().split('T')[0];
    const isFuture = new Date(date.dateString) > new Date();
    const dayOfWeek = new Date(date.dateString).getDay();
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    let content;
    if (diary) {
      content = <DiaryImage source={{uri: diary.imageUrl}} />;
    } else if (isToday) {
      content = (
        <Pressable
          onPress={() => navigation.navigate('WriteDiaryWebView', {selectedDate: date.dateString})}
        >
          <TodayPlaceholder>
            <PlusImage source={require('../assets/Plus.png')} />
          </TodayPlaceholder>
        </Pressable>
      );
    } else {
      content = <Placeholder />;
    }

    return (
      <Pressable
        onPress={() => {
          if (diary) {
            navigation.navigate('DetailDiaryWebView', {id: diary.diaryId});
          } else if (!isFuture || isToday) {
            navigation.navigate('WriteDiaryWebView', {selectedDate: date.dateString});
          }
        }}
      >
        <DayContainer>
          {content}
          <DayText isFuture={isFuture} isSunday={isSunday} isSaturday={isSaturday}>
            {date.day}
          </DayText>
        </DayContainer>
      </Pressable>
    );
  };

  return (
    <Container>
      <Header>
        <HeaderText>{formatHeaderDate(currentMonth)}</HeaderText>
      </Header>

      <StyledCalendar
        theme={{
          'stylesheet.calendar.main': {
            week: {
              marginTop: 20,
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
          },
          'stylesheet.calendar.header': {
            week: {
              marginTop: 10,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
            dayTextAtIndex0: {
              color: '#d90c0c',
            },
            dayTextAtIndex6: {
              color: '#0851c3',
            },
          },
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#000000',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          monthTextColor: 'blue',
        }}
        dayComponent={({date}) => renderDay(date)}
        firstDay={0}
        hideExtraDays
        renderHeader={() => null}
        onMonthChange={onMonthChange}
        enableSwipeMonths
        renderArrow={() => null}
        disableArrowLeft
        disableArrowRight
        hideArrows
      />
    </Container>
  );
}

export default Calendars;
