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
    {
      property: 'twitter:creator',
      content:
        settings &&
        settings.meta &&
        settings.meta.social &&
        settings.meta.social.twitter
    },
    { property: 'twitter:image:src', content: image },
    { property: 'twitter:card', content: 'summary_large_image' },
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
      property: 'og:modified_time',
      content: updatedAt || new Date().toISOString()
    }
  ];

  return metaTags;
};

const HeadCustom = (props) => {
  const { title, description, image } = props;
  // const imagess = useImageBase64({ url: image });
  const schemaType = props.schemaType || HeadCustom.defaultProps.schemaType;
  const url = props.url || HeadCustom.defaultProps.url;
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {socialTags(props).map(({ property, content }) => {
        return <meta key={property} property={property} content={content} />;
      })}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': schemaType,
            name: title,
            about: description,
            url
          })
        }}
      />
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
  image:
    settings &&
    settings.meta &&
    settings.meta.social &&
    settings.meta.social.graphic
};

HeadCustom.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
};

export default HeadCustom;
