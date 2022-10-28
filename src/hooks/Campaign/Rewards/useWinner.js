import API from './api.gql';
import { initializeApollo } from 'src/libs/SystemApolloClient';
import utils from 'src/libs/utils';
export const HandleGenerateWinner = async (props) => {
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

export default {
  HandleGenerateWinner
};
