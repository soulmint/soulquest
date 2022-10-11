import { useQuery } from '@apollo/client';
import API from './details.api.gql';

export default (props) => {
  const { slug } = props;

  const { getCampaign } = API;

  const { data, loading, error } = useQuery(getCampaign, {
    fetchPolicy: 'no-cache',
    skip: !slug,
    variables: {
      slug
    }
  });

  return {
    loading,
    data,
    error
  };
};
