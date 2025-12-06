module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@components': './src/components',
          '@pages': './src/pages',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@slices': './src/slices',
          '@assets': './src/assets',
          '@styles': './src/styles',
          '@store': './src/store',
          '@api': './src/api',
          '@shared-types': './src/shared/types',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
};
