import WalletConnectProvider from '@walletconnect/web3-provider';
// import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const providerOptions = {
  /*walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        25: "https://evm.cronos.org/",
      },
      network: 'cronos',
      chainId: 25
    },
    qrcodeModalOptions: {
      mobileLinks: [
        "metamask",
        "trust",
        "argent",
        "rainbow",
        "imtoken",
        "pillar",
      ]
    }
  },*/
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: `${process.env.APP_INFURA_ID}` // required
    }
  }
  // coinbasewallet: {
  //   package: CoinbaseWalletSDK, // Required
  //   options: {
  //     appName: 'Soulmint App', // Required
  //     infuraId: `${process.env.APP_INFURA_ID}` // Required
  //   }
  // },
  /*, binancechainwallet: {
    package: true
  } */
};
export default providerOptions;
