/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import MainTmpl from './_mainTmpl';
// import Steps from '../organisms/HowItWork';

const HowItWorksTmp = (props: any) => {
  const { children } = props;
  console.log(children);
  return (
    <Fragment>
      <MainTmpl>
        <div className="mx-auto max-w-screen-xl py-12 px-6">{children}</div>
      </MainTmpl>
    </Fragment>
  );
};

HowItWorksTmp.propTypes = {};

export default HowItWorksTmp;
