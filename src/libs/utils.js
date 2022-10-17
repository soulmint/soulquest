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
    if (page == 'campaign-details') {
      base.title = data.title;
      base.description = utils.htmlToString(data.short_desc);
      base.image = `${process.env.MEDIA_BASE_URL}/${data.thumb_image.id}?format=jpg&width=500`;
      base.img_title = data.thumb_image.title;
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
};
export default utils;
