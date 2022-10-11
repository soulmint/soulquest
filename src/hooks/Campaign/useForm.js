import Router from 'next/router';
import { useCallback, useRef, useMemo, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import slugify from 'slugify';
import API from './api.gql';
import BrowserPersistence from '../../utils/simplePersistence';
import { capitalize, ellipsify } from '../../utils/strUtils';

export default (props) => {
  const { campaignId, afterSavedCampaign } = props;
  const { addMutation, editMutation, loadCampaignByIdQuery } = API;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const storage = new BrowserPersistence();
  const currentCampaign = storage.getItem('currentCampaign');
  let initialValues = currentCampaign ? currentCampaign : [];

  //load campaign information for initial values on form
  const [
    getCampaign,
    { loading: campaignLoading, error: campaignLoadError, data: campaignLoaded }
  ] = useLazyQuery(loadCampaignByIdQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });
  useEffect(() => {
    if (campaignId) {
      getCampaign({
        skip: !campaignId,
        variables: {
          id: campaignId
        }
      });
    }
  }, [campaignId, getCampaign]);

  initialValues = useMemo(() => {
    return !campaignLoading && campaignLoaded && campaignLoaded.campaign_by_id
      ? { ...campaignLoaded.campaign_by_id }
      : [];
  }, [campaignLoaded, campaignLoading]);

  // Update selected NFT collection from NFT collection details page context
  const nftCollectionOptionSelected = storage.getItem(
    'nft_collection_opt_selected'
  );
  if (!campaignId && nftCollectionOptionSelected) {
    if (!initialValues) {
      initialValues = [];
    }
    initialValues.nft_collection_opt_selected = nftCollectionOptionSelected;
  } else {
    //build nft collection options
    if (initialValues.nft_collection_ids) {
      const nftCollectionOptions = [];
      initialValues.nft_collection_ids.map((nftCollection) => {
        const data = nftCollection.nft_collection_id;
        nftCollectionOptions.push({
          value: parseInt(data.id),
          label: `${capitalize(data.chain_name)} > ${data.name} (${ellipsify({
            str: data.contract_address,
            start: 5,
            end: 4
          })})`
        });
      });
      initialValues.nft_collection_opt_selected = nftCollectionOptions;
    }
  }

  const formApiRef = useRef(initialValues);
  const setFormApi = useCallback((api) => (formApiRef.current = api), []);
  const detailsRef = useRef(
    initialValues && initialValues.description
      ? initialValues.description
      : null
  );
  const rewardOverviewRef = useRef(
    initialValues && initialValues.reward_overview
      ? initialValues.reward_overview
      : null
  );

  // function to handle saving campaign information
  const mutationApi = campaignId ? editMutation : addMutation;
  const [
    saveCampaignInformation,
    {
      data: saveCampaignResult,
      error: createCampaignError,
      loading: saveCampaignLoading
    }
  ] = useMutation(mutationApi, {
    fetchPolicy: 'no-cache'
  });

  // function to handle callback after submit on the campaign form
  const handleSaveCampaign = useCallback(
    async (submittedValues) => {
      try {
        //checking to update cover & thumb images if it has
        const coverUploadedFiles = storage.getItem('cpCoverImageUploaded');
        submittedValues.cover_image =
          coverUploadedFiles && coverUploadedFiles[0]
            ? coverUploadedFiles[0].directus_file
            : null;
        const thumbUploadedFiles = storage.getItem('cpThumbImageUploaded');
        submittedValues.thumb_image =
          thumbUploadedFiles && thumbUploadedFiles[0]
            ? thumbUploadedFiles[0].directus_file
            : null;

        //saving submitted data to local storage
        storage.setItem('currentCampaign', submittedValues, 3600);

        submittedValues.slug = slugify(submittedValues.title).toLowerCase();
        if (submittedValues.show_on_rada === undefined)
          submittedValues.show_on_rada = false;

        //build nft_collection_ids
        const nft_collection_ids = [];
        if (submittedValues.nftCollections.length) {
          submittedValues.nftCollections.map(function (option) {
            nft_collection_ids.push({
              nft_collection_id: { id: parseInt(option.value) }
            });
          });
        }

        await saveCampaignInformation({
          variables: {
            id: campaignId ? parseInt(campaignId) : null,
            nft_collection_ids,
            ...submittedValues
          }
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error);
        }
        return;
      }

      if (afterSavedCampaign) {
        afterSavedCampaign();
      }

      //Reset form fields state
      if (formApiRef.current) {
        formApiRef.current.reset();
      }
      if (detailsRef.current) {
        detailsRef.current = null;
      }
      storage.removeItem('currentCampaign');
      storage.removeItem('nft_collection_opt_selected');
    },

    [afterSavedCampaign, campaignId, saveCampaignInformation, storage]
  );

  const handleCancel = useCallback(() => {
    Router.push('/');
  }, []);

  const errors = useMemo(
    () =>
      new Map([
        [campaignId ? 'editMutation' : 'addMutation', createCampaignError],
        ['loadCampaignQuery', campaignLoadError]
      ]),
    [campaignId, createCampaignError, campaignLoadError]
  );

  return {
    setFormApi,
    formApiRef,
    detailsRef,
    rewardOverviewRef,
    initialValues,
    handleSaveCampaign,
    handleCancel,
    isBusy:
      campaignLoading || (campaignId && !initialValues) || saveCampaignLoading,
    errors,
    saveCampaignResult
  };
};
