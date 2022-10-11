import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NftCollectionDetailTmpl from '../../components/templates/nftCollectionDetailTmpl';

const NftCollectionDetailPage: NextPage = () => {
  const router = useRouter();
  const query = router?.query?.slug;
  const slug = query?.[0] ?? '';
  return <NftCollectionDetailTmpl slug={slug} />;
};

export default NftCollectionDetailPage;

export async function getStaticProps(props: { locale: string }) {
  props.locale = props.locale ? props.locale : 'en';
  return {
    props: {
      ...(await serverSideTranslations(props.locale, [
        'common',
        'nft_collection_details'
      ]))
      // Will be passed to the page component as props
    }
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  };
};
