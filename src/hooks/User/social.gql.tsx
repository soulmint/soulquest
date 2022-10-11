import { gql } from '@apollo/client';

export const CREATE_SOCIAL_LINK_GQL = gql`
  mutation create_social_link_item($data: create_social_link_input!) {
    create_social_link_item(data: $data) {
      uid
      username
      name
    }
  }
`;

export const GET_SOCIAL_LINK_GQL = gql`
  query get_social_link(
    $social_name: string_filter_operators!
    $uid: string_filter_operators!
  ) {
    social_link(filter: { name: $social_name, uid: $uid }) {
      uid
      username
      name
    }
  }
`;

export const UPDATE_SOCIAL_LINK_GQL = gql`
  mutation update_social_link_item($id: ID!, $data: update_social_link_input!) {
    update_social_link_item(id: $id, data: $data) {
      name
      username
    }
  }
`;

export default {
  CREATE_SOCIAL_LINK_GQL,
  UPDATE_SOCIAL_LINK_GQL,
  GET_SOCIAL_LINK_GQL
};
