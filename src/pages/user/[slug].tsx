import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
const UserSlug: NextPage = () => {
  const router = useRouter();
  const slug = router?.query?.slug;
  return <div>{slug}</div>;
};

export default UserSlug;
