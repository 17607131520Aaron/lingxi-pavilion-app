const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'ts', 'tsx', 'svg', 'json'],
    extraNodeModules: {
      stream: require.resolve('stream-browserify'),
      'readable-stream': require.resolve('readable-stream'),
      'react-native-url-polyfill': require.resolve('react-native-url-polyfill'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
