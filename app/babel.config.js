module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
=======
    // 밑의 내용을 추가
>>>>>>> 5d711a7 (feat : PROJ-142 : 카카오 로그인 버튼 클릭시 로그인 페이지로 리다이렉트)
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
<<<<<<< HEAD
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
=======
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
>>>>>>> 5d711a7 (feat : PROJ-142 : 카카오 로그인 버튼 클릭시 로그인 페이지로 리다이렉트)
        },
      ],
    ],
  };
};
