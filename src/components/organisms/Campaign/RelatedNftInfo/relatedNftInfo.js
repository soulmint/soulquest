import React from 'react';
import { array, bool, shape, string } from 'prop-types';
// import { useTranslation } from 'next-i18next';
import defaultClasses from './relatedNftInfo.module.css';
import { useStyle } from 'src/components/classify';
import useThemes from 'src/hooks/useThemes';
import TextLink from 'src/components/atoms/TextLink';
import { ellipsify, getChainName } from 'src/utils/strUtils';

const RelatedNftInfo = (props) => {
  const {
    classes: propClasses,
    nftCollections,
    showChainName = true,
    showCollectionLink = true,
    showSmcAdd = true
  } = props;

  const classes = useStyle(defaultClasses, propClasses);

  // const { t } = useTranslation('campaign_details');

  const { rootClassName } = useThemes();

  let total = 0;
  const child = nftCollections.length
    ? nftCollections.map((nftCollection, index) => {
        total++;
        const chainName = getChainName(
          nftCollection.nft_collection_id.chain_name
        );
        const separator = total < nftCollections.length ? ',' : null;
        const rs = (
          <div key={index} className={`${classes.nftCollectionWrap}`}>
            {showChainName ? (
              <span title={chainName}>
                <span className={classes.chainName}>
                  {chainName} {separator}
                </span>
              </span>
            ) : null}
            {showCollectionLink ? (
              <TextLink
                className={classes.nftCollectionLink}
                href={`/nft-collection-details/${nftCollection.nft_collection_id.slug}`}
              >
                <span
                  className={`${classes.collectionName} ${
                    classes[nftCollection.nft_collection_id.chain_name]
                  }`}
                >
                  {nftCollection.nft_collection_id.name}
                </span>
                {showSmcAdd ? (
                  <span className={classes.contractAdd}>
                    (
                    {ellipsify({
                      str: nftCollection.nft_collection_id.contract_address,
                      start: 4,
                      end: 4
                    })}
                    )
                  </span>
                ) : null}
              </TextLink>
            ) : null}
          </div>
        );

        return rs;
      })
    : null;

  return <div className={`${classes[rootClassName]}`}>{child}</div>;
};

RelatedNftInfo.propTypes = {
  classes: shape({
    root: string
  }),
  nftCollections: array,
  showChainName: bool,
  showCollectionLink: bool,
  showSmcAdd: bool
};

export default RelatedNftInfo;
