/** @type {import('next').NextConfig} */
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add the copy-webpack-plugin
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(process.cwd(), "../zk-proof/circuits/**/*"),
              to: path.resolve(process.cwd(), "public/circuits"),
            },
          ],
        })
      );
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/home",
        destination: "https://www.sirenwatch.xyz",
      },
    ];
  },
};

export default nextConfig;
