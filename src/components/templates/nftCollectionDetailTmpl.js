/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import MainTmpl from './_mainTmpl';
import PropTypes from 'prop-types';
import Details from '../organisms/Campaign/NftCollection/Details';

const NftCollectionDetailTmpl = (props) => {
  const { slug } = props;

  return (
    <Fragment>
      <MainTmpl>
        <Details slug={slug} />
      </MainTmpl>
    </Fragment>
  );
};

NftCollectionDetailTmpl.propTypes = {
  slug: PropTypes.string.isRequired
};

export default NftCollectionDetailTmpl;
