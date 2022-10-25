import { useQuery } from '@apollo/client';
import API from './details.api.gql';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { isWhitelisted } from './useGoogle';
import { setIsWhitelisted } from '../../store/user/operations';

export default (props) => {
  const { slug } = props;

  const { getCampaign } = API;

  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);
  const address = userState.wallet_address ? userState.wallet_address : null;

  const { data, loading, error } = useQuery(getCampaign, {
    fetchPolicy: 'no-cache',
    skip: !slug,
    variables: {
      slug
    }
  });

  useEffect(async () => {
    let campaign = null;

    if (data && data.campaign.length) {
      campaign = data.campaign[0];
    }

    // If has specific whitelist addresses from a Google sheet
    setIsWhitelisted(dispatch, false);
    if (
      campaign &&
      campaign.whitelist_spreadsheet_id &&
      campaign.whitelist_sheet_id &&
      address
    ) {
      const rs = await isWhitelisted({
        spreadsheet_id: campaign.whitelist_spreadsheet_id,
        sheet_id: campaign.whitelist_sheet_id,
        wallet_address: address
      });
      // Update for user state
      setIsWhitelisted(dispatch, rs);
    }
  }, [address, data]);

  return {
    loading,
    data,
    error,
    userState
  };
};
