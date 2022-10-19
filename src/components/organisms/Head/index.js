import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
// import useImageBase64 from '../../../hooks/useImageBase64';
import settings from './settings';

const socialTags = ({
  type,
  url,
  title,
  description,
  keywords,
  image,
  createdAt,
  updatedAt
}) => {
  const metaTags = [
    { property: 'twitter:card', content: 'summary_large_image' },
    {
      property: 'twitter:site',
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter
    },
    { property: 'twitter:title', content: title },
    { property: 'twitter:description', content: description },
    { property: 'twitter:image', content: image },
    { property: 'twitter:image:src', content: image },
    {
      property: 'twitter:creator',
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter
    },
    { property: 'og:title', content: title },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:description', content: description },
    {
      property: 'og:site_name',
      content: settings && settings.meta && settings.meta.title
    },
    {
      property: 'og:published_time',
      content: createdAt || new Date().toISOString()
    },
    {
      property: 'article:tag',
      content: keywords || settings.meta.keywords
    },
    {
      property: 'article:section',
      content: type
    },
    {
      property: 'article:published_time',
      content: updatedAt || new Date().toISOString()
    },
    {
      property: 'article:author',
      content: 'Soulmint'
    }
  ];

  return metaTags;
};

const HeadCustom = (props) => {
  const data = {};
  data.schemaType = props.schemaType || HeadCustom.defaultProps.schemaType;
  data.url = props.url || HeadCustom.defaultProps.url;
  data.title = props.title || HeadCustom.defaultProps.title;
  data.description = props.description || HeadCustom.defaultProps.description;
  data.image = props.image || HeadCustom.defaultProps.image;
  data.keywords = props.keywords
    ? `${props.keywords}, ${settings.meta.keywords}`
    : settings.meta.keywords;
  return (
    <Head>
      <title>{data.title}</title>
      <meta name="title" content={data.title} />
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      {socialTags(data).map(({ property, content }) => {
        return <meta key={property} property={property} content={content} />;
      })}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': data.schemaType,
            name: data.title,
            about: data.description,
            url: data.url
          })
        }}
      />
      <meta name="application-name" content="SoulMint" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SoulMint" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="robots"
        content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
      />
      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/touch-icon-iphone-retina.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/icons/touch-icon-ipad.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/icons/touch-icon-ipad-retina.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};

HeadCustom.defaultProps = {
  url: '/',
  openGraphType: 'website',
  schemaType: 'Article',
  type: 'article',
  title: settings && settings.meta && settings.meta.title,
  description: settings && settings.meta && settings.meta.description,
  image: settings && settings.meta && settings.meta.image
};

HeadCustom.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
};

export default HeadCustom;
