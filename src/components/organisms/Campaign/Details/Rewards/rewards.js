import React from 'react';
import { bool, shape, string } from 'prop-types';
// import { useTranslation } from 'next-i18next';
import Moment from 'moment';
import classes from './rewards.module.css';
import Quest from './Quest';
import Questers from './Questers';
import HowClaim from './HowClaim';
import Summary from './Summary';
import useThemes from 'src/hooks/useThemes';
import Image from 'src/components/atoms/Image';
import Screen from 'src/utils/responsive';
// import Coupon from './Coupon';
import Claim from './Claim';
import Winners from './Winners';

const Rewards = (props) => {
  const { campaign } = props;

  const { rootClassName } = useThemes();

  // const { t } = useTranslation('campaign_details');

  const endDate = Moment(campaign.date_end);
  const now = Moment();
  const isEnded = now > endDate ? true : true;
  const run_winnered = campaign.run_winnered;
  const shortDesc = campaign.short_desc ? (
    <div
      className={classes.shortDesc}
      dangerouslySetInnerHTML={{ __html: campaign.short_desc }}
    />
  ) : null;

  const description = campaign.description ? (
    <div
      className={classes.desc}
      dangerouslySetInnerHTML={{ __html: campaign.description }}
    />
  ) : null;

  const summary = <Summary campaign={campaign} />;

  const howToClaim = campaign.how_to_claim ? (
    <HowClaim content={campaign.how_to_claim} />
  ) : null;

  const quest = <Quest campaign={campaign} />;

  const questers = (
    <Questers
      campaignId={campaign.id}
      winnered={run_winnered}
      is_ended={isEnded}
      rw_method={campaign.reward_method}
      reward_number={campaign.reward_number}
    />
  );

  const claimInfo = (
    <Claim
      is_ended={isEnded}
      campaign_id={campaign.id}
      reward_method={campaign.reward_method}
      reward_token_volume={campaign.reward_token_volume}
      reward_number={campaign.reward_number}
      date_ends={campaign.date_end}
    />
  );

  const windersInfo = isEnded ? <Winners campaignId={campaign.id} /> : null;

  // Build cover and thumb images
  const assetsBaseUrl = process.env.MEDIA_BASE_URL;
  const coverOptions = 'fit=cover';
  const coverImage =
    campaign.cover_image && campaign.cover_image.id ? (
      <Image
        layout="fill"
        className={`${classes.campaignCover} relative`}
        placeholder="blur"
        src={`${assetsBaseUrl}/${campaign.cover_image.id}?${coverOptions}`}
        alt={`cover_${campaign.title}`}
      />
    ) : null;

  // const thumbOptions = 'fit=cover';
  // const thumbImage =
  //   campaign.thumb_image && campaign.thumb_image.id ? (
  //     <Image
  //       layout="fill"
  //       className={`${classes.campaignThumb}`}
  //       placeholder="blur"
  //       src={`${assetsBaseUrl}/${campaign.thumb_image.id}?${thumbOptions}`}
  //       alt={`cover_${campaign.title}`}
  //     />
  //   ) : null;
  //const coupon = campaign.coupon ? <Coupon campaign={campaign} /> : null; //coming soon

  return (
    <div className={`${classes[rootClassName]}`}>
      <div className={`${classes.pageContent}`}>
        {quest}
        <Screen upto="md">{summary}</Screen>
        <div className={`card ${classes.pageContentInner}`}>
          <div className={`${classes.coverImage}`}>{coverImage}</div>
          {shortDesc}
          {description}
        </div>
      </div>
      <div className={`${classes.pageSidebar}`}>
        {claimInfo}
        {windersInfo}

        <Screen from="lg">{summary}</Screen>

        {questers}
        {howToClaim}
      </div>
    </div>
  );
};

Rewards.propTypes = {
  classes: shape({
    root: string
  }),
  campaign: shape({
    id: string
  })
};

export default Rewards;
