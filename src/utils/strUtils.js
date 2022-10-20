export const ellipsify = (props) => {
  if (typeof props.start === 'undefined') props.start = 5;
  if (!props.end) props.end = 3;
  const { str, start, end } = props;
  if (str.length > start) {
    return str.slice(0, start) + '...' + str.slice(str.length - end);
  }
  return str;
};

export const toHTML = (str) => ({ __html: str });

export const subStrWords = (
  str,
  maxLength,
  separator = ' ',
  suffix = '...'
) => {
  if (str.length <= maxLength) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLength)) + suffix;
};

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

const chains = new Map()
  .set('bsc', 'BSC')
  .set('ethereum', 'Ethereum')
  .set('polygon', 'Polygon')
  .set('solana', 'Solana');
export const getChainName = (chainKey) =>
  (chainKey && chains.get(chainKey)) || chainKey;

export default {
  ellipsify,
  toHTML,
  subStrWords,
  capitalize,
  getChainName
};
export const base64URLDecode = (str) =>
  Buffer.from(str, 'base64').toString('binary');
export const base64URLEncode = (str) =>
  Buffer.from(str, 'binary').toString('base64');
