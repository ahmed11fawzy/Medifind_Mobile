// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix MIME type issues
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];

// Disable Hermes for web
config.transformer = {
  ...config.transformer,
  unstable_transformProfile: process.env.PLATFORM_NAME === 'web' ? undefined : 'hermes-stable',
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {}
};

// Fix MIME type issues for web
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add proper MIME types for web
      if (req.url.endsWith('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config; 