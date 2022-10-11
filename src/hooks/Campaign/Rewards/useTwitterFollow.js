import { useCallback } from 'react';
import { TwitterFollow } from './useTwitter';

export default (props) => {
  const { user_id, owner_id } = props;
  const handleCheckTwitterFollow = useCallback(async () => {
    const data = await TwitterFollow({ user_id, owner_id });
    return data;
  }, [user_id, owner_id]);
  return {
    handleCheckTwitterFollow
  };
};
