import {React, useEffect, useState} from 'react';
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import useApiCall from '../hooks/useApiTest';
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

function Calendars({navigation}) {
  const [widthRatio, setWidthRatio] = useState(0);
  const FIGMA_WIDTH = 640;

  useEffect(() => {
    const updateWidthRatio = () => {
      const windowWidth = Dimensions.get('window').width;
      const newWidthRatio = windowWidth / FIGMA_WIDTH;
      setWidthRatio(newWidthRatio);
    };

    updateWidthRatio();

    const subscription = Dimensions.addEventListener('change', updateWidthRatio);

    return () => subscription?.remove();
  }, []);

  const theme = {
    widthRatio,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 40,
    },
    header: {
      padding: 20,
      backgroundColor: '#fff',
    },
    headerText: {
      fontSize: 36 * theme.widthRatio,
      fontWeight: 'bold',
    },
    calendar: {
      borderWidth: 0,
      borderColor: '#eee',
      paddingLeft: 0,
      paddingRight: 0,
    },
    dayContainer: {
      width: '100%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 2,
    },
    dayText: {
      textAlign: 'center',
      fontSize: 22 * theme.widthRatio,
      marginBottom: 2,
      fontWeight: 300,
    },
    diaryImage: {
      width: 68 * theme.widthRatio,
      height: 68 * theme.widthRatio,
      borderRadius: 10,
      marginTop: 2,
    },
    placeholder: {
      width: 68 * theme.widthRatio,
      height: 68 * theme.widthRatio,
      borderRadius: 10,
      marginTop: 2,
      backgroundColor: '#E0E0E0', // 회색 네모의 색상
    },
    todayPlaceholder: {
      width: 68 * theme.widthRatio,
      height: 68 * theme.widthRatio,
      borderRadius: 10,
      marginTop: 2,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    plusImage: {
      width: 30 * theme.widthRatio,
      height: 30 * theme.widthRatio,
    },
    sundayText: {
      color: '#d90c0c',
    },
    saturdayText: {
      color: '#0851c3',
    },
    disabledTextWeekday: {
      color: '#000',
      opacity: 0.5,
    },
    disabledTextSaturday: {
      color: '#0851c3',
      opacity: 0.5,
    },
    disabledTextSunday: {
      color: '#d90c0c',
      opacity: 0.5,
    },

    weekDayContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: '#fff',
    },
    weekDayText: {
      fontSize: 26 * theme.widthRatio,
      color: '#333',
    },
  });

  // 한경 api 호출
  const {data, isLoading, error, AxiosApi} = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await AxiosApi('get', '/api/v1/diary/list');
      } finally {
        console.log('done');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('바로 나오는지 확인하는', data);
    }
  }, [data]);

  // 현재 표시중인 월
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 이미지 URL을 날짜와 매핑한 객체 (서버에서 받아올 데이터)
  const diaryImages = {
    '2024-07-01': require('../assets/favicon.png'),
    '2024-07-06': require('../assets/favicon.png'),
  };

  // 요일 헤더 렌더링

  // 월 변경시 호출되는 함수
  const onMonthChange = month => {
    setCurrentMonth(new Date(month.timestamp));
  };

  // 헤더에 표시할 날짜 형식 변경
  const formatHeaderDate = date =>
    `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;

  // 각 날짜 셀 렌더링
  const renderDay = date => {
    const imageSource = diaryImages[date.dateString];
    const isToday = date.dateString === new Date().toISOString().split('T')[0];
    const isFuture = new Date(date.dateString) > new Date();
    const dayOfWeek = new Date(date.dateString).getDay();
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    let content;
    if (imageSource) {
      content = <Image source={imageSource} style={styles.diaryImage} />;
    } else if (isToday) {
      content = (
        <Pressable
          style={styles.todayPlaceholder}
          onPress={() => {
            navigation.navigate('WriteDiaryWebView');
          }}
        >
          <Image source={require('../assets/Plus.png')} style={styles.plusImage} />
        </Pressable>
      );
    } else {
      content = <View style={styles.placeholder} />;
    }

    let textStyle;
    if (isFuture) {
      if (isSunday) {
        textStyle = [styles.dayText, styles.disabledTextSunday];
      } else if (isSaturday) {
        textStyle = [styles.dayText, styles.disabledTextSaturday];
      } else {
        textStyle = [styles.dayText, styles.disabledTextWeekday];
      }
    } else {
      textStyle = [
        styles.dayText,
        isSunday && styles.sundayText,
        isSaturday && styles.saturdayText,
      ];
    }
    return (
      <View style={styles.dayContainer}>
        {content}
        <Text style={textStyle}>{date.day}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{formatHeaderDate(currentMonth)}</Text>
      </View>

      <Calendar
        style={styles.calendar}
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
          textDayFontSize: 26 * theme.widthRatio,
          textDayHeaderFontSize: 26 * theme.widthRatio,
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
    </View>
  );
}

export default Calendars;
