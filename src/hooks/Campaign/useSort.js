import { useState } from 'react';

const defaultSort = {
  sortText: 'Newest',
  sortId: 'sortItem.newest',
  sortAttribute: 'date_created',
  sortDirection: 'DESC'
};

const searchSort = {
  sortText: 'Hits',
  sortId: 'sortItem.hits',
  sortAttribute: 'hits',
  sortDirection: 'DESC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) => {
  const { sortFromSearch = false } = props;
  return useState(() =>
    Object.assign({}, sortFromSearch ? searchSort : defaultSort, props)
  );
};
