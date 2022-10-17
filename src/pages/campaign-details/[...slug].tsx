import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';

import utils from '../../libs/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CampaignDetailTmpl from '../../components/templates/campaignDetailTmpl';
import { getCampaignDetail } from 'src/hooks/Campaign/useDetailPage';

interface CampaignDetailProps {
  campaign?: any;
  slug?: string | string[];
  locale?: string;
}
const CampaignDetailPage: NextPage<CampaignDetailProps> = (props) => {
  const { campaign, slug } = props;
  const { asPath } = useRouter();
  const page = `campaign-details`;
  const meta = utils.createMetaData({ page, data: campaign }, asPath);

  return <CampaignDetailTmpl slug={slug[0]} meta={meta} />;
};

export default CampaignDetailPage;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const data = await getCampaignDetail({
    slug: context.params.slug[0]
  });
  if (!data) {
    return {
      notFound: true
    };
  }
  let props = {
    locale: context.locale,
    slug: context.params.slug,
    campaign: data
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props = Object.assign(props, {
    ...(await serverSideTranslations(context.locale, [
      'common',
      'campaign_details'
    ]))
  });
  return {
    props,
    revalidate: 60
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  };
};
