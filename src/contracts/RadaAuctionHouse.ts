import { AbiItem } from 'web3-utils';
import { abi } from './json/RadaAuctionHouse.json';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const contractAddress = process.env
  .RADA_AUCTION_HOUSE_CONTRACT_ADDRESS as string;

const getContract = (web3: Web3) => {
  return new web3.eth.Contract(
    abi as AbiItem[],
    getRadaAuctionHouseContractAddress(),
  );
};

export const getRadaAuctionHouseContractAddress = (): string => {
  return contractAddress;
};

export const callAuction = (web3: Web3): Promise<any> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods.auction().call((err: any, res: any) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    }),
  );
};

export const executeSettleCurrentAndCreateNewAuction = (
  web3: Web3,
  account: string,
): Promise<any> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods
      .settleCurrentAndCreateNewAuction()
      .send({ from: account })
      .on('error', (error: any) => reject(error))
      .on('receipt', (receipt: any) => resolve(receipt)),
  );
};

export const executeCreateBid = (
  web3: Web3,
  account: string,
  wei: BigNumber,
  nftId: number,
): Promise<any> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods
      .createBid(nftId)
      .send({
        from: account,
        value: `0x${wei.toString(16)}`,
      })
      .on('error', (error: any) => reject(error))
      .on('receipt', (receipt: any) => resolve(receipt)),
  );
};
