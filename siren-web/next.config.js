const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack"); // Import webpack to use NormalModuleReplacementPlugin

const _getPublicEnv = (prefix) => {
  const envs = process.env;
  const res = {};

  Object.keys(envs).forEach((k) => {
    if (k.startsWith(prefix)) {
      res[k] = envs[k];
    }
  });

  return res;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  publicRuntimeConfig: {
    ..._getPublicEnv("NEXT_PUBLIC_"),
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
      };

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^hexoid$/,
          require.resolve('hexoid/dist/index.js')
        )
      );
    }

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, "../circuits"),
            to: path.join(__dirname, "public/circuits"),
          },
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;