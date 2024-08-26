/** @type {import('next').NextConfig} */
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "../zk-proof/circuits/**/*",
              to: path.resolve(process.cwd(), "public/circuits"),
            },
          ],
        })
      );
    }

    return config;
  },
  swcMinify: false,
};

export default nextConfig;
