/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  publicExcludes: [
    "!vendors/*",
    "!vendors/!**!/!*",
    "!vendors/!**!/!**!/!*",
    "!vendors/!**!/!**!/!**/!*",
  ],
  buildExcludes: [/chunks\/.*$/],
  disable: process.env.NODE_ENV === 'development'
});

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  // next.js config
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false
  },
	typescript: {
		 ignoreBuildErrors: true,
	},
  env: {
    BSC_URL: process.env.BSC_URL,
    BSC_CHAIN_ID: process.env.BSC_CHAIN_ID,
    BSC_NETWORK_ID: process.env.BSC_NETWORK_ID,
    // RADA_TOKEN_CONTRACT_ADDRESS: process.env.RADA_TOKEN_CONTRACT_ADDRESS,
    // RADA_AUCTION_HOUSE_CONTRACT_ADDRESS:
    // process.env.RADA_AUCTION_HOUSE_CONTRACT_ADDRESS,
    // BSC_EXPLORER_URL: process.env.BSC_EXPLORER_URL,
    PUBLIC_URL: process.env.PUBLIC_URL,
    MEDIA_BASE_URL: process.env.MEDIA_BASE_URL,
    GRAPHQL_ENDPOINT_URL: process.env.GRAPHQL_ENDPOINT_URL,
    GRAPHQL_ENDPOINT_SYSTEM_URL: process.env.GRAPHQL_ENDPOINT_SYSTEM_URL,
    GRAPHQL_ENDPOINT_SYSTEM_API_TOKEN: process.env.GRAPHQL_ENDPOINT_SYSTEM_API_TOKEN,
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
    CONNECT_WALLET_WELCOME_MSG: process.env.CONNECT_WALLET_WELCOME_MSG
  },
  i18n,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  experimental: { optimizeCss: true },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "public.nftstatic.com",
      "lh3.googleusercontent.com",
      "public.bnbstatic.com",
      "s2.coinmarketcap.com",
      "dev.dhunt.io"
    ],
  }
};
//module.exports = withPWA(nextConfig);
module.exports = process.env.NODE_ENV === 'production' ? withPWA(nextConfig) : nextConfig;

