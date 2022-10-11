/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

const MainTmpl = (props) => {
  const { children } = props;

  return (
    <Fragment>
      <Header />
      <main>{children}</main>
      <Footer />
    </Fragment>
  );
};

MainTmpl.propTypes = {};

export default MainTmpl;
