import React, { Fragment, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import { shape, string } from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import { Form } from 'informed';
import { isRequired } from '../../../utils/formValidators';
import FormError from '../../atoms/FormError';
import Field from '../../atoms/Field';
import TextInput from '../../atoms/TextInput';
import TextArea from '../../atoms/TextArea';
import Button from '../../atoms/Button';
// import Checkbox from '../../atoms/Checkbox';
import Uploader from '../../organisms/Uploader';
import { Editor } from '@tinymce/tinymce-react';
import TINY_MCE_CONFIG from './tinyMCE.config';
import { useForm } from '../../../hooks/Campaign';
import { useStyle } from '../../classify';
import { Percent, Twitter, AtSign } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Selector from './NftCollection/Selector';
import defaultClasses from './form.module.css';

const CampaignForm = (props) => {
  const { classes: propClasses, campaignId } = props;

  const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('create_campaign');

  const { theme } = useTheme();
  const rootClassName = theme === 'dark' ? 'rootDark' : 'root';

  const { plugins, toolbar } = TINY_MCE_CONFIG;
  const tinyInit = {
    branding: false,
    height: 300,
    menubar: false,
    placeholder: t('Other detail about your campaign?'),
    plugins,
    toolbar,
    skin: 'oxide',
    content_css: 'default',
    content_style: 'body {}'
  };
  if (theme === 'dark') {
    tinyInit.skin = 'oxide-dark';
    tinyInit.content_css = 'dark';
  }

  const discountUnit = <Percent />;
  const followIcon = <AtSign />;
  const twitterIcon = <Twitter />;

  const afterSavedCampaign = useCallback(() => {
    toast.success(
      t(
        "You have just saved campaign's information successfully. We will consider to approve your campaign as soon as possible."
      ),
      {
        onClose: () => {
          //coming soon
          Router.push('/my-campaign');
        }
      }
    );
  }, [toast, t]);

  const {
    errors,
    handleSaveCampaign,
    handleCancel,
    isBusy,
    setFormApi,
    formApiRef,
    detailsRef,
    rewardOverviewRef,
    initialValues
  } = useForm({ campaignId, afterSavedCampaign });

  const [nftCollections, setNftCollections] = useState([]);
  const [activeDates, setActiveDates] = useState({});
  const onDateChange = (dates) => {
    const [start, end] = dates;
    setActiveDates({
      start_date: start,
      end_date: end
    });
  };

  useEffect(() => {
    const initNftCollections =
      initialValues && initialValues.nft_collection_opt_selected
        ? initialValues.nft_collection_opt_selected
        : [];
    if (initNftCollections.length) {
      setNftCollections(initNftCollections);
    }

    const initDates = {
      start_date:
        initialValues && initialValues.date_start
          ? new Date(initialValues.date_start)
          : null,
      end_date:
        initialValues && initialValues.date_end
          ? new Date(initialValues.date_end)
          : null
    };
    setActiveDates(initDates);
  }, [initialValues]);

  let child = null;
  if (!isBusy) {
    child = (
      <div className={`${classes[rootClassName]}`}>
        <h2 className={`${classes.pageTitle}`}>{t('Campaign introduction')}</h2>
        <FormError allowErrorMessages errors={Array.from(errors.values())} />
        <Form
          getApi={setFormApi}
          className={classes.form}
          initialValues={initialValues}
          onSubmit={() =>
            handleSaveCampaign({
              nftCollections,
              reward_overview: rewardOverviewRef.current.getContent(),
              description: detailsRef.current.getContent(),
              date_start: activeDates.start_date,
              date_end: activeDates.end_date,
              ...formApiRef.current.getValues()
            })
          }
        >
          <div className={`${classes.fields}`}>
            <h3 className={classes.fieldGroupTitle}>
              {t('General Information')}
            </h3>
            <Field id="campaign-title" label={t('Title')}>
              <TextInput
                autoComplete="title"
                field="title"
                id="campaign-title"
                validate={isRequired}
                validateOnBlur
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter campaign title...')}
              />
            </Field>
            <Field id="campaign-overview" label={t('Overview')}>
              <TextArea
                id="short-desc"
                field="short_desc"
                placeholder={t('Enter overview about the campaign...')}
              />
            </Field>
            <Field id="campaign-description" label={t('Full details')}>
              <Editor
                tinymceScriptSrc={
                  process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                }
                onInit={(evt, editor) => (detailsRef.current = editor)}
                initialValue={
                  initialValues && initialValues.description
                    ? initialValues.description
                    : ''
                }
                init={tinyInit}
              />
              <span className={classes.tip}>
                {t('Describe the campaign in detail.')}
              </span>
            </Field>
            <Field id="campaign-cover-image" label={t('Cover Image')}>
              <Uploader
                id="cpCoverImage"
                storageKeyName="cpCoverImageUploaded"
                uploaderContainerId="cpCoverContainer"
                previewContainerId="cpCoverPreviewContainer"
                allowedFileTypes={['.jpg', '.jpeg', '.png', '.gif']}
                allowMultipleFiles={false}
                maxNumberOfFiles={1}
                storageFolder={{
                  id: '5cfb4e1e-16e8-4ae0-98ca-bda9a9b743cc',
                  name: 'campaign'
                }}
              />
            </Field>
            <Field id="campaign-thumb-image" label={t('Thumb Image')}>
              <Uploader
                id="cpThumbImage"
                storageKeyName="cpThumbImageUploaded"
                uploaderContainerId="cpThumbContainer"
                previewContainerId="cpThumbPreviewContainer"
                allowedFileTypes={['.jpg', '.jpeg', '.png', '.gif']}
                allowMultipleFiles={false}
                maxNumberOfFiles={1}
                storageFolder={{
                  id: '5cfb4e1e-16e8-4ae0-98ca-bda9a9b743cc',
                  name: 'campaign'
                }}
              />
            </Field>
            <Field
              id="campaign-dates"
              classes={{ root: classes['rdwDatepicker'] }}
              label={t('Active dates')}
            >
              <DatePicker
                onChange={onDateChange}
                startDate={activeDates.start_date}
                endDate={activeDates.end_date}
                selectsRange
                isClearable={true}
                dateFormatCalendar={'MMM yyyy'}
                minDate={new Date()}
              />
            </Field>
            {/*<Field id="campaign-show-on-rada" label={``}>
              <Checkbox
                id="show_on_rada"
                field="show_on_rada"
                value={true}
                label="Enable show your campaign on Soulmint.net"
              />
            </Field>*/}
          </div>

          <div className={`${classes.fields}`}>
            <h3 className={classes.tokenOwnership}>
              {t('Token Ownership Requirement')}
            </h3>
            <Field id="campaign-nft-collection" label={t('NFT Collection')}>
              <Selector
                selectedOption={
                  initialValues && initialValues.nft_collection_opt_selected
                    ? initialValues.nft_collection_opt_selected
                    : []
                }
                handleChange={setNftCollections}
              />
              <span className={classes.tip}>
                {t(
                  'You can specify collections, and the user will need to own an NFT from them.'
                )}
              </span>
            </Field>
          </div>

          <div className={`${classes.fields}`}>
            <h3 className={classes.twitterTasks}>
              {t('Twitter Requirements')}
            </h3>
            <Field
              id="campaign-twitter-follow-username"
              label={t('Must Follow Account')}
            >
              <TextInput
                id="twitter_username"
                before={followIcon}
                after={twitterIcon}
                autoComplete="twitter-username"
                field="twitter_username"
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter your Twitter username')}
              />
            </Field>
            <Field id="campaign-twitter-tweet-url" label={t('Must Re-tweet')}>
              <TextInput
                id="twitter_tweet"
                after={twitterIcon}
                autoComplete="twitter-tweet"
                field="twitter_tweet"
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter your tweet URL')}
              />
            </Field>
          </div>

          <div className={`${classes.fields}`}>
            <h3 className={classes.rewardGroupTitle}>{t('Rewards')}</h3>
            <Field id="campaign-reward-overview" label={t('Reward Overview')}>
              <Editor
                tinymceScriptSrc={
                  process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'
                }
                onInit={(evt, editor) => (rewardOverviewRef.current = editor)}
                initialValue={
                  initialValues && initialValues.reward_overview
                    ? initialValues.reward_overview
                    : ''
                }
                init={tinyInit}
              />
            </Field>
            <Field id="campaign-coupon-codes" label={t('Coupon Codes')}>
              <TextArea
                id="coupon_codes"
                field="coupon_codes"
                rows={2}
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter coupon codes...')}
              />
              <span className={classes.tip}>
                {t('Separate codes by coma. Eg: CT65K6962NV8, ZZ8EP933J925')}
              </span>
            </Field>
            <Field id="campaign-discount-value" label={t('Discount Value')}>
              <TextInput
                after={discountUnit}
                autoComplete="campaign-discount-value"
                field="discount_value"
                id="discount_value"
                mask={(value) => value && parseInt(value)}
                maskOnBlur={true}
                placeholder={t('E.g 30')}
              />
            </Field>
            <Field id="campaign-store-name" label={t('Store Name')}>
              <TextInput
                autoComplete="store-name"
                field="store_name"
                id="store_name"
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter store name')}
              />
            </Field>
            <Field id="campaign-store-logo-url" label={t('Store Logo')}>
              <TextInput
                autoComplete="store-logo"
                field="store_logo_url"
                id="store_logo_url"
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter logo image url')}
              />
            </Field>
            <Field id="campaign-store-url" label={t('Store URL')}>
              <TextInput
                autoComplete="store-url"
                field="store_url"
                id="store_url"
                mask={(value) => value && value.trim()}
                maskOnBlur={true}
                placeholder={t('Enter store url')}
              />
              <span className={classes.tip}>
                {t('Specify the shop URL where apply the coupons.')}
              </span>
            </Field>
          </div>
          <div className={`${classes.buttonsContainer}`}>
            <div className={`w-1/2 h-12`}>
              <Button
                priority="normal"
                onPress={() => handleCancel()}
                type="button"
                disabled={isBusy}
              >
                {t('Cancel')}
              </Button>
            </div>
            <div className={`w-1/2 h-12 text-right`}>
              <Button priority="high" type="submit" disabled={isBusy}>
                {t('Next Step')}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  } else {
    child = <div className={classes.loading}>{t('Loading...')}</div>;
  }

  return <Fragment>{child}</Fragment>;
};

CampaignForm.propTypes = {
  classes: shape({
    root: string
  }),
  campaignId: string
};

export default CampaignForm;
