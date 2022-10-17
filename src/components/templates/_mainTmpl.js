/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import Header from '../organisms/Header';
import HeadCustom from '../organisms/Head';
import Footer from '../organisms/Footer';

const MainTmpl = (props) => {
  const { children, meta } = props;

  return (
    <Fragment>
      <HeadCustom {...meta} />
      <Header />
      <main>{children}</main>
      <Footer />
    </Fragment>
  );
};

MainTmpl.propTypes = {};

export default MainTmpl;
