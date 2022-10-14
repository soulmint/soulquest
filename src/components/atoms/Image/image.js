import ImageNext from 'next/image';
import { useState, useEffect } from 'react';

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const Image = (props) => {
  // Fix  Avoid Hydration Mismatch #https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const data = {
    layout: 'fixed',
    blurDataURL: `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`,
    ...props
  };

  if (props.placeholder === 'blur') {
    const w = props.placeholder_w ? props.placeholder_w : 700;
    const h = props.placeholder_h ? props.placeholder_h : 475;
    data.blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
  }

  return <ImageNext {...data} />;
};

export default Image;
