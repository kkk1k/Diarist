import React, {useState, useEffect} from 'react';
import {Routes, Route} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {DiaryProvider} from './context/DiaryContext';
import Calendar from './pages/Calendar';
import WritingDiaryPage from './pages/WritingDiaryPage';
import DrawCompletedPage from './pages/DrawCompletedPage';
import SelectDrawerPage from './pages/SelectDrawerPage';
import DrawerListPage from './pages/DrawerListPage';
import AlbumPage from './pages/AlbumPage';
import SelectEmotionPage from './pages/SelectEmotionPage';
import DrawDetailPage from './pages/DrawDetailPage';
import GlobalStyle from './GlobalStyle';

function DiaryFlow() {
  return (
    <DiaryProvider>
      <Routes>
        <Route path='/emotion' element={<SelectEmotionPage />} />
        <Route path='/write' element={<WritingDiaryPage />} />
        <Route path='/selectdrawer' element={<SelectDrawerPage />} />
      </Routes>
    </DiaryProvider>
  );
}

function App() {
  const [widthRatio, setWidthRatio] = useState(0);
  const FIGMA_WIDTH = 640;

  useEffect(() => {
    const updateWidthRatio = () => {
      const newWidthRatio = window.innerWidth / FIGMA_WIDTH;
      setWidthRatio(newWidthRatio);
    };

    updateWidthRatio();
    window.addEventListener('resize', updateWidthRatio);

    return () => {
      window.removeEventListener('resize', updateWidthRatio);
    };
  }, []);

  const theme = {
    widthRatio,
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Calendar />} />
        <Route path='/complete' element={<DrawCompletedPage />} />
        <Route path='/drawerlist' element={<DrawerListPage />} />
        <Route path='/album' element={<AlbumPage />} />
        <Route path='/detail' element={<DrawDetailPage />} />
        <Route path='/*' element={<DiaryFlow />} />
      </Routes>
    </ThemeProvider>
  );
}
export default App;
