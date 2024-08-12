import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // '0.0.0.0'로 설정하여 모든 네트워크 인터페이스에서 접속 가능하도록 함
    port: 5173,
    proxy: {
      // S3 버킷에 대한 프록시 설정 추가
      '/s3-bucket': {
        target: 'https://hanium-diarist.s3.ap-northeast-2.amazonaws.com', // 환경 변수 사용
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/s3-bucket/, ''),
      },
      '/r2': {
        target: 'https://pub-09792a1b5cf149c985d34ff32f53df0e.r2.dev', // 환경 변수 사용
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/r2/, ''),
      },
    },
  },
});
