import React from 'react';
import { array, bool, shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
import defaultClasses from './relatedNftInfo.module.css';
import { useStyle } from 'src/components/classify';
import useThemes from 'src/hooks/useThemes';
import TextLink from 'src/components/atoms/TextLink';
import { ellipsify } from 'src/utils/strUtils';

const RelatedNftInfo = (props) => {
  const {
    classes: propClasses,
    nftCollections,
    showChainName = true,
    showCollectionLink = true
  } = props;

  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  const { rootClassName } = useThemes();

  let child = null;

  child = nftCollections.length
    ? nftCollections.map((nftCollection, index) => (
        <div key={index} className={`${classes.nftCollectionWrap}`}>
          {showChainName ? (
            <span
              className={`${
                classes[nftCollection.nft_collection_id.chain_name]
              }`}
            >
              <span className={classes.chainName}>
                {nftCollection.nft_collection_id.chain_name}
              </span>
            </span>
          ) : null}

          {showCollectionLink ? (
            <TextLink
              className={classes.nftCollectionLink}
              href={`/nft-collection-details/${nftCollection.nft_collection_id.slug}`}
            >
              <span className={`${classes.collectionName}`}>
                {nftCollection.nft_collection_id.name}
              </span>{' '}
              <span className={classes.contractAdd}>
                (
                {ellipsify({
                  str: nftCollection.nft_collection_id.contract_address,
                  start: 4,
                  end: 4
                })}
                )
              </span>{' '}
            </TextLink>
          ) : null}
        </div>
      ))
    : null;

  return <div className={`${classes[rootClassName]}`}>{child}</div>;
};

RelatedNftInfo.propTypes = {
  classes: shape({
    root: string
  }),
  nftCollections: array,
  showChainName: bool,
  showCollectionLink: bool
};

export default RelatedNftInfo;
