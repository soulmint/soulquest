/* eslint-disable @typescript-eslint/ban-types */
export const useHeroData = (props = {}) => {
  const { type, Data } = props;

  const HeroData = Data.get(type);

  return HeroData;
};
