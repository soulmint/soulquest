export const subString = (props: any) => {
  if (typeof props.start === 'undefined') props.start = 5;
  if (!props.end) props.end = 3;
  const { str, start, end } = props;

  if (str.length > start && str.toString().startsWith('0x')) {
    return str.slice(0, start) + '...' + str.slice(str.length - end);
  }
  return str;
};
export const formatDate = (date: {
  getDate: () => any;
  getMonth: () => number;
  getFullYear: () => any;
}) => {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear()
  ].join('-');
};

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
export const formatEndDate = (
  duration: number,
  date: {
    getDate: () => number;
    getMonth: () => number;
    getFullYear: () => any;
  }
) => {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate() + duration),
    date.getFullYear()
  ].join('/');
};
export const twDecode = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary');
export const twEncode = (str: string): string =>
  Buffer.from(str, 'binary').toString('base64');
