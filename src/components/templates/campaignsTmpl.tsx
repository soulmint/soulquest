/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import MainTmpl from './_mainTmpl';
import List from '../organisms/Campaign/List';

const CampaignsTmpl = () => {
  return (
    <Fragment>
      <MainTmpl>
        <List position="campaigns-page" />
      </MainTmpl>
    </Fragment>
  );
};

CampaignsTmpl.propTypes = {
  classes: shape({
    root: string
  })
};

export default CampaignsTmpl;
