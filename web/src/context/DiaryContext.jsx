import React, {createContext, useState, useContext, useMemo} from 'react';

const DiaryContext = createContext();

function DiaryProvider({children}) {
  const [selectedEmotion, setSelectedEmotion] = useState('0');
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryDate, setDiaryDate] = useState('');

  const value = useMemo(
    () => ({
      selectedEmotion,
      setSelectedEmotion,
      diaryContent,
      setDiaryContent,
      diaryDate,
      setDiaryDate,
    }),
    [selectedEmotion, diaryContent, diaryDate],
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

function useDiary() {
  return useContext(DiaryContext);
}

export {DiaryProvider, useDiary};
