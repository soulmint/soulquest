import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: `${process.env.APP_INFURA_ID}` // required
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'rada.works App', // Required
      infuraId: `${process.env.APP_INFURA_ID}` // Required
    }
  }
  /*, binancechainwallet: {
    package: true
  } */
};
export default providerOptions;
