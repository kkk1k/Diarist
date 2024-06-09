import React from 'react';

function WritingDiaryPage() {
  return (
    <div className='px-[4.6875%] h-screen'>
      {/* sr-only */}
      <h1 className='sr-only'>일기 작성</h1>
      {/* 상단 메뉴 컨테이너 */}
      <div className='flex items-center justify-between mb-3'>
        <img src='/btn_prev.png' alt='뒤로가기' className='w-[13.28125%]' />
        <p className='text-[18px]'>2/3</p>
        <img src='/btn_x.png' alt='닫기' className='w-[13.28125%]' />
      </div>
      {/* 일기 작성 타이틀 */}
      <div className='text-center mb-[30px]'>
        <h2 className='text-[28px]'>당신의 특별한 일상을</h2>
        <h2 className='text-[28px]'>기록해주세요</h2>
        <p className='text-[16px] font-light'>
          당신의 일기는 선택한 화가의 그림으로 재탄생 됩니다.
        </p>
      </div>
      <textarea className='border border-[#666] rounded-[20px] p-[28px] w-full text-[16px] h-1/2' />
      <p className='text-right text-[12px]'>50/1000</p>
      {/* 버튼 컨테이너 */}
      <div className='flex justify-between mt-[40px]'>
        <button type='button' className='w-[47.3%] py-[18px] border border-black rounded-[15px]'>
          건너뛰기
        </button>
        <button
          type='button'
          className='w-[47.3%] py-[18px] border bg-black text-white rounded-[15px]'
        >
          다 적었어요
        </button>
      </div>
    </div>
  );
}

export default WritingDiaryPage;
