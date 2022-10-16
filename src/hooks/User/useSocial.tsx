import { initializeApollo } from '../../libs/apolloClient';
import { CREATE_SOCIAL_LINK_GQL, GET_SOCIAL_LINK_GQL } from './social.gql';

export const saveSocialLink = async (vars: any) => {
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.mutate({
      mutation: CREATE_SOCIAL_LINK_GQL,
      variables: { data: vars }
    });
    rs = data.create_social_link_item ? data.create_social_link_item : null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(error);
    }
  }

  return rs;
};
export const checkExistsSocialLink = async (
  socialName: any,
  userCreated: any
) => {
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_SOCIAL_LINK_GQL,
      variables: {
        social_name: socialName,
        user_created: userCreated
      },
      fetchPolicy: 'no-cache'
    });
    if (data.social_link && data.social_link[0]) {
      rs = data.social_link[0];
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return error;
  }

  return rs;
};

/*export const checkExistsSocialLink = async (socialName: any, userId: any) => {
  let rs = null;
  const client = initializeApollo();
  try {
    const { data } = await client.query({
      query: GET_SOCIAL_LINK_GQL,
      variables: {
        social_name: socialName,
        uid: userId
      },
      fetchPolicy: 'no-cache'
    });
    if (data.social_link && data.social_link[0]) {
      rs = data.social_link[0];
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return error;
  }

  return rs;
};*/

export default {
  saveSocialLink,
  checkExistsSocialLink
};
