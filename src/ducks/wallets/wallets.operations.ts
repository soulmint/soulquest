// import BigNumber from 'bignumber.js';
// import { NextRouter } from 'next/router';
import { Dispatch } from 'react';
// import {
//   // executeCreateBid,
//   executeSettleCurrentAndCreateNewAuction,
// } from 'src/contracts/RadaAuctionHouse';
import Web3 from 'web3';

// import {
//   fetchCurrentTokenId,
//   fetchNounAuctionInfo,
// } from '../nouns/nouns.operations';

import * as actions from './wallets.actions';
import { WalletsAction } from './wallets.types';

export const connectWallet = (
  dispatch: Dispatch<WalletsAction>,
  provider: any,
  web3: Web3,
  account: string
) => {
  dispatch(actions.connectWalletAction(provider, web3, account));
};

// export const settleAuction = async (
//   dispatch: Dispatch<WalletsAction>,
//   router: NextRouter,
//   contextWeb3: Web3,
//   walletWeb3: Web3,
//   account: string,
// ) => {
//   try {
//     const result = await executeSettleCurrentAndCreateNewAuction(
//       walletWeb3,
//       account,
//     );
//     alert(`Transaction success. Hash: ${result.transactionHash}`);
//
//     const query = { ...router.query };
//     delete query.tokenId;
//
//     // await fetchCurrentTokenId(dispatch, contextWeb3);
//     // await fetchNounAuctionInfo(dispatch, contextWeb3);
//
//     await router.push({
//       pathname: router.pathname,
//       query: { ...query },
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };

// export const createBid = async (
//   dispatch: Dispatch<WalletsAction>,
//   router: NextRouter,
//   contextWeb3: Web3,
//   currentTokenId: number,
//   walletWeb3: Web3,
//   account: string,
//   wei: BigNumber,
// ) => {
//   try {
//     const result = await executeCreateBid(
//       walletWeb3,
//       account,
//       wei,
//       currentTokenId,
//     );
//     alert(`Transaction success. Hash: ${result.transactionHash}`);
//
//     const query = { ...router.query };
//     delete query.tokenId;
//
//     await fetchCurrentTokenId(dispatch, contextWeb3);
//     await fetchNounAuctionInfo(dispatch, contextWeb3);
//
//     await router.push({
//       pathname: router.pathname,
//       query: { ...query },
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };
