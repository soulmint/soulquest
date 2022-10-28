import API from './api.gql';
import { initializeApollo } from 'src/libs/SystemApolloClient.js';
import utils from 'src/libs/utils';
const HandleGenerateWinner = async (props) => {
  const { campaignId, rw_number, rw_method, is_ended } = props;
  if (!is_ended) return null;
  const filter = {
    status: { _eq: 'approved' },
    campaign_id: { _eq: campaignId }
  };
  const { data } = await API.getAllQuesterApproved({
    filter,
    sort: ['date_created']
  });
  let dataWinner = [];
  const fcfsData = data.quester;
  const idarr = data.quester.map((item) => item.id);
  switch (rw_method) {
    case 'fcfs':
      for (let index = 0; index < fcfsData.length; index++) {
        if (dataWinner.length === rw_number) break;
        dataWinner.push(fcfsData[index].id);
      }
      break;
    case 'lucky_draw':
      dataWinner = utils.generateKeyWinner(rw_number, idarr);
      break;

    default:
      break;
  }
  if (
    is_ended &&
    (dataWinner.length === rw_number || dataWinner.length === fcfsData.length)
  ) {
    const { data } = await API.generateWinner({
      ids: dataWinner
    });
    if (data) {
      await API.updateCampaignWinner({ campaignId });
    }
  }

  return true;
};
export const updateCampaignWinner = async (props) => {
  const { campaignId } = props;
  const client = initializeApollo();
  let rs;
  console.log('====================================');
  console.log('campaignId', campaignId);
  console.log('====================================');
  try {
    const { data, loading, error } = await client.mutate({
      mutation: API.UPDATE_CAMPAIGN,
      variables: {
        id: campaignId,
        data: { run_winnered: true }
      },
      fetchPolicy: 'no-cache'
    });
    rs = { data, loading, error };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return error;
  }

  return rs;
};
export default HandleGenerateWinner;
