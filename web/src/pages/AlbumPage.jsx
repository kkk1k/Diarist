import {React, useState, useEffect} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {parseISO, format, compareDesc, compareAsc} from 'date-fns';
import ListAlbum from '../components/ListAlbum';
import ThumbnailAlbum from '../components/ThumbnailAlbum';

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

const MainContainer = styled.div`
  margin-left: ${props => 30 * props.theme.widthRatio}px;
  margin-right: ${props => 30 * props.theme.widthRatio}px;
  padding-bottom: ${props => 80 * props.theme.widthRatio}px; /* BottomNav의 높이만큼 여유 공간 */
`;

const H2 = styled.h2`
  font-size: ${props => 42 * props.theme.widthRatio}px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.63px;
`;

const ButtonImage = styled.img`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 30 * props.theme.widthRatio}px;
`;

const ViewButton = styled.button`
  background-color: #fff;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;

const SelectButton = styled.button`
  width: ${props => 70 * props.theme.widthRatio}px;
  height: ${props => 40 * props.theme.widthRatio}px;
  border-radius: 100px;
  color: #fff;
  text-align: center;
  font-size: ${props => 18 * props.theme.widthRatio}px;
  font-weight: 500;
  background: #000;
`;

const HeaderMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => 20 * props.theme.widthRatio}px;
`;

const ThumbnailHeaderMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${props => 20 * props.theme.widthRatio}px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => 20 * props.theme.widthRatio}px;
  align-items: center;
`;

const H3 = styled.h3`
  color: #000;
  font-size: ${props => 30 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.45px;
`;

const Bold = styled.span`
  font-weight: 500;
`;

const Select = styled.select`
  border: none;
`;

const ThumbnailUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => 20 * props.theme.widthRatio}px;
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-top: ${props => 40 * props.theme.widthRatio}px;
  padding-bottom: ${props => 40 * props.theme.widthRatio}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  z-index: 100;
`;

const BottomP = styled.p`
  font-size: ${props => 28 * props.theme.widthRatio}px;
  font-weight: 300;
  line-height: normal;
  letter-spacing: -0.42px;
  padding-left: ${props => 210 * props.theme.widthRatio}px;
`;

const BottomImage = styled.img`
  width: ${props => 40 * props.theme.widthRatio}px;
  height: ${props => 40 * props.theme.widthRatio}px;
  margin-right: ${props => 30 * props.theme.widthRatio}px;
`;

const BottomButton = styled.button`
  background-color: #fff;
`;

const API_BASE_URL = 'https://hellorvdworld.com';
const TOKEN = '';

function AlbumPage() {
  const [view, setView] = useState('thumbnail');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState('최신순');
  const [originalBookmarks, setOriginalBookmarks] = useState([]);

  const handleListView = () => {
    setView('list');
  };

  const handleThumbnailView = () => {
    setView('thumbnail');
  };

  const handleSelectClick = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      console.log('Selected IDs:', selectedIds);
    }
  };

  const navigateToDetailPage = id => {
    console.log('Navigate to detail page:', id);
  };

  const getSeason = month => {
    if (month >= 3 && month <= 5) {
      return '봄';
    }
    if (month >= 6 && month <= 8) {
      return '여름';
    }
    if (month >= 9 && month <= 11) {
      return '가을';
    }
    return '겨울';
  };

  const handleThumbnailClick = id => {
    if (isSelectionMode) {
      setSelectedIds(prevSelectedIds =>
        prevSelectedIds.includes(id)
          ? prevSelectedIds.filter(selectedId => selectedId !== id)
          : [...prevSelectedIds, id],
      );
    } else {
      navigateToDetailPage(id);
    }
  };

  const formatAndSortBookmarks = (data, order) =>
    data
      .sort((a, b) =>
        order === '최신순'
          ? compareDesc(parseISO(a.diaryDate), parseISO(b.diaryDate))
          : compareAsc(parseISO(a.diaryDate), parseISO(b.diaryDate)),
      )
      .map(bookmark => ({
        ...bookmark,
        formattedDate: format(parseISO(bookmark.diaryDate), 'MM. dd'),
        year: format(parseISO(bookmark.diaryDate), 'yyyy'),
        season: getSeason(parseISO(bookmark.diaryDate).getMonth() + 1),
      }));

  const [sortedBookmarks, setSortedBookmarks] = useState([]);

  useEffect(() => {
    if (bookmarks.data) {
      setSortedBookmarks(formatAndSortBookmarks(bookmarks.data, sortOrder));
    }
  }, [bookmarks.data, sortOrder]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/diary/bookmark/list`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: '*/*',
        },
      });
      setOriginalBookmarks(response.data.data);
      console.log(response.data);
      const formattedAndSortedBookmarks = formatAndSortBookmarks(response.data.data, sortOrder);
      console.log(formattedAndSortedBookmarks);
      setBookmarks({...response.data, data: formattedAndSortedBookmarks});
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('북마크 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedIds([]);
    }
  }, [isSelectionMode]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSortChange = e => {
    setSortOrder(e.target.value);
  };

  if (isLoading) return <div>로딩중</div>;
  if (error) return <div>{error}</div>;

  return (
    <MainContainer>
      {view === 'thumbnail' && <A11yHidden>앨범 썸네일 보기 형식 페이지</A11yHidden>}
      {view === 'list' && <A11yHidden>앨범 리스트 보기 형식 페이지</A11yHidden>}

      {/* 상단 네비바 */}
      <HeaderMenu>
        <H2>나의 앨범</H2>
        <ButtonContainer>
          {view === 'list' && (
            <>
              <ViewButton type='button' onClick={handleThumbnailView} disabled={isSelectionMode}>
                <ButtonImage src='/thumbnailFalse.png' alt='썸네일 보기 형식' />
              </ViewButton>
              <ViewButton type='button' onClick={handleListView} disabled={isSelectionMode}>
                <ButtonImage src='/listTrue.png' alt='리스트 보기 형식' />
              </ViewButton>
            </>
          )}
          {view === 'thumbnail' && (
            <>
              <ViewButton type='button' onClick={handleThumbnailView} disabled={isSelectionMode}>
                <ButtonImage src='/thumbnailTrue.png' alt='썸네일 보기 형식' />
              </ViewButton>
              <ViewButton type='button' onClick={handleListView} disabled={isSelectionMode}>
                <ButtonImage src='/listFalse.png' alt='리스트 보기 형식' />
              </ViewButton>
            </>
          )}
          <SelectButton type='button' onClick={handleSelectClick}>
            {isSelectionMode ? '취소' : '선택'}
          </SelectButton>
        </ButtonContainer>
      </HeaderMenu>

      {/* 앨범 네비바 */}

      {view === 'thumbnail' && (
        <>
          <ThumbnailHeaderMenu>
            <Select disabled={isSelectionMode} onChange={handleSortChange} value={sortOrder}>
              <option value='최신순'>최신순</option>
              <option value='오래된순'>오래된순</option>
            </Select>
          </ThumbnailHeaderMenu>
          <ThumbnailUl>
            {sortedBookmarks.map(bookmark => (
              <ThumbnailAlbum
                key={bookmark.diaryId}
                src={bookmark.imageUrl}
                id={bookmark.diaryId}
                onClick={() => handleThumbnailClick(bookmark.diaryId)}
                isSelected={selectedIds.includes(bookmark.diaryId)}
                isSelectionMode={isSelectionMode}
              />
            ))}
          </ThumbnailUl>
        </>
      )}

      {view === 'list' && (
        <ul>
          {sortedBookmarks.map((bookmark, index) => {
            const showHeader =
              index === 0 ||
              sortedBookmarks[index - 1].year !== bookmark.year ||
              sortedBookmarks[index - 1].season !== bookmark.season;

            return (
              <div key={bookmark.diaryId}>
                {showHeader && (
                  <HeaderMenu>
                    <H3>
                      {bookmark.year}년 <Bold>{bookmark.season}</Bold>
                    </H3>
                    {index === 0 && (
                      <Select
                        disabled={isSelectionMode}
                        onChange={handleSortChange}
                        value={sortOrder}
                      >
                        <option value='최신순'>최신순</option>
                        <option value='오래된순'>오래된순</option>
                      </Select>
                    )}
                  </HeaderMenu>
                )}
                <ListAlbum
                  src={bookmark.imageUrl}
                  id={bookmark.diaryId}
                  date={bookmark.formattedDate}
                  artist={bookmark.artist}
                  emotion={bookmark.emotion}
                  content={bookmark.content}
                  onClick={() => handleThumbnailClick(bookmark.diaryId)}
                  isSelected={selectedIds.includes(bookmark.diaryId)}
                  isSelectionMode={isSelectionMode}
                />
              </div>
            );
          })}
        </ul>
      )}

      {isSelectionMode && selectedIds.length > 0 && (
        <BottomNav>
          <BottomP>
            <Bold>{selectedIds.length}개</Bold>의 일기가 선택됨
          </BottomP>
          <BottomButton type='button' onClick={handleSelectClick} aria-label='button'>
            <BottomImage src='BlackStar.png' alt='' />
          </BottomButton>
        </BottomNav>
      )}
    </MainContainer>
  );
}

export default AlbumPage;
