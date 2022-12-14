const utils = {
  createMetaData: ({ page, data }, asPath = '') => {
    const base = {
      title: 'Reward distribution platform based on SoulBound Token - SoulMint',
      description:
        'SoulMint is a reward distribution platform based on SoulBound Token. It is a decentralized platform that allows users to create and manage their own reward distribution campaigns.',
      image: 'https://soulmint.io/images/og-image.png',
      img_title: 'SoulMint App',
      url: `${process.env.PUBLIC_URL}/`,
      keywords: 'soulbound token, web3 reward distribution platform',
      createdAt: new Date().toISOString()
    };
    if (page == 'campaign-details' && data) {
      base.title = data.title;
      base.description = utils.htmlToString(data.short_desc);
      base.image = `${process.env.MEDIA_BASE_URL}/${data.cover_image.id}?format=jpg&width=500`;
      base.img_title = data.cover_image.title;
      base.url = `${process.env.PUBLIC_URL}/${asPath}`;
      base.keywords = `${base.keywords}${
        data.tags ? ', ' + data.tags.map((tag) => tag.name).join(', ') : ''
      }`;
      base.createdAt = data.date_created || base.createdAt;
    }

    return base;
  },
  htmlToString: (html) => {
    const str = html.replace(/(<([^>]+)>)/gi, '').replace(/(\r\n|\n|\r)/gm, '');
    if (str.length > 250) {
      return str.substring(0, 250) + '...';
    }
    return str;
  }
  // generateWinnerIds: (rw_number, soulIds) => {
  //   const numbers = utils.generateNumbersArray(rw_number);
  //   const ids = utils.generateWinIds(numbers, soulIds);
  //   return ids;
  // },
  // generateNumbersArray: (totalNumbers) => {
  //   const numbers = [];
  //   for (let i = 1; i <= totalNumbers; i++) {
  //     numbers.push(i);
  //   }
  //   return numbers;
  // },
  // generateWinIds: (numbers, totalNumbers) => {
  //   const drawnNumbers = [];
  //   let sortedWinArray;
  //
  //   totalNumbers?.forEach((num) => {
  //     const numbersToDrawFrom = numbers?.filter(
  //       (num) => !drawnNumbers?.includes(num)
  //     );
  //     const newRandNum = utils.generateRandomNumber(
  //       numbersToDrawFrom.length,
  //       numbersToDrawFrom
  //     );
  //     drawnNumbers.push(newRandNum);
  //   });
  //   if (drawnNumbers?.length >= totalNumbers.length) {
  //     sortedWinArray = utils.sortNumbers(drawnNumbers);
  //   }
  //   return sortedWinArray;
  // },
  // generateRandomNumber: (totalNumbers, totalNumbersArray) => {
  //   const randomNumberIndex = Math.floor(Math.random() * totalNumbers + 1);
  //   return totalNumbersArray[randomNumberIndex - 1];
  // },
  // sortNumbers: (drawnNumbers) => {
  //   const sortedWinArray = drawnNumbers?.sort((a, b) => a - b);
  //   return sortedWinArray;
  // }
};
export default utils;
