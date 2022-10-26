import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApollo } from '../../../libs/apolloClient';
import utils from 'src/libs/utils';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { questers, reward_number, totalNumbers } = req.query;

    const Client = initializeApollo();

    const numbers = utils.generateNumbersArray(totalNumbers);
    const generateRandomNumber = (
      totalNumbers: number,
      totalNumbersArray: number[]
    ) => {
      const randomNumberIndex = Math.floor(Math.random() * totalNumbers + 1);
      return totalNumbersArray[randomNumberIndex - 1];
    };
    const sortNumbers = (numbers: number[]) => {
      return numbers.sort((a, b) => a - b);
    };
  } catch (error) {
    // return error;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Questers > Generate winning numbers: ', error);
    }
    return res.status(500).send({ error });
  }
};
