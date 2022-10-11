import { AbiItem } from 'web3-utils';
import { abi } from './json/RadaToken.json';
import Web3 from 'web3';

const contractAddress = process.env.RADA_TOKEN_CONTRACT_ADDRESS as string;

const getContract = (web3: Web3) => {
  return new web3.eth.Contract(abi as AbiItem[], getRadaTokenContractAddress());
};

export const getRadaTokenContractAddress = (): string => {
  return contractAddress;
};

export const callCurrentNftId = (web3: Web3): Promise<string> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods.currentNftId().call((err: any, res: any) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    }),
  );
};

export const callDataUri = (web3: Web3, tokenId: number): Promise<string> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods.dataURI(tokenId).call((err: any, res: any) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    }),
  );
};

export const callOwnerOf = (web3: Web3, tokenId: number): Promise<string> => {
  const contract = getContract(web3);

  return new Promise((resolve, reject) =>
    contract.methods.ownerOf(tokenId).call((err: any, res: any) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    }),
  );
};
