import React from 'react';
interface ImageData {
  url: string;
  width: number;
  height: number;
}
const useImageBase64: React.FC<ImageData> = (props) => {
  const { url } = props;
  const [img, setImg] = React.useState<any>();
  const fetchImage = async () => {
    const reader = new FileReader();
    const res = await fetch(url);
    const imageBlob = await res.blob();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setImg(base64data);
    };
  };
  React.useEffect(() => {
    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return img;
};
export default useImageBase64;
