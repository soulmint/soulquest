export const kFormatter = (number) => {
  return Math.abs(number) > 999
    ? Math.sign(number) * (Math.abs(number) / 1000).toFixed(1) + 'k'
    : Math.sign(number) * Math.abs(number);
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

export default {
  kFormatter,
  formatBytes,
  randomNumber
};
