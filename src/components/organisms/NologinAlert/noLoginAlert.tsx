import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import ConnectWallet from '../User/ConnectWallet';

const NoLoginAlert = () => {
  const { status } = useSession();
  const { t } = useTranslation('noLoginAlert');
  let children = null;
  if (status === 'unauthenticated') {
    children = (
      <div className="text-center">
        <div className="text-xl font-bold">{t("You're not signed in")}</div>
        <div className="text-lg">
          {t('Get access to this contest by connecting your wallet.')}
        </div>
        <ConnectWallet />
      </div>
    );
  }
  return children;
};
export default NoLoginAlert;
