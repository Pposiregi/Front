module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'module:react-native-dotenv',
            {
                moduleName: '@env',
                path: '.env',
            },
        ],
        [
            'module-resolver',
            {
                root: ['./src'],
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
                },
            },
        ]
    ],
};
