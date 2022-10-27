import { useState, useCallback } from 'react';
import { GET_CLAIMED, UPDATE_WINNER } from './api.gql';
import { initializeApollo } from 'src/libs/apolloClient';
import { useMutation } from '@apollo/client';

export default async (props) => {
  const { campaign_id, rewards_method, wallet, is_ended } = props;
  const [isWinner, setIsWinner] = useState(false);
  const [claimed, setClaimed] = useState([]);
  if (!wallet) return null;
  const filter = {
    status: { _eq: 'approved' },
    campaign_id: { _eq: campaign_id }
  };
  let rs = null;
  let variables = {
    filter
  };
  if (rewards_method === 'fcfs') {
    variables.sort = ['date_created:asc'];
  }

  if (!is_ended) {
    return {
      isWinner
    };
  }
  const handleFCFSGenerateWinner = useCallback(async () => {
    console.log('====================================');
    console.log('handleGenerateWinner');
    console.log('====================================');
    return { data: [], error: null };
  }, []);
  const handleGenerateLuckyDrawWinner = useCallback(async (props) => {
    return { data: ['luckyDraw'], error: null };
  }, []);

  return {
    handleFCFSGenerateWinner,
    handleGenerateLuckyDrawWinner
  };
};
