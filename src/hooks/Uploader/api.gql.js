import { gql } from '@apollo/client';
import { initializeApollo } from '../../../src/libs/SystemApolloClient.js';

export const IMPORT_FILE = gql`
  mutation ImportJobFile(
    $url: String!
    $data: create_directus_files_input! #https://docs.directus.io/reference/files.html#the-file-object
  ) {
    import_file(url: $url, data: $data) {
      id
      storage
      filename_download
      uploaded_on
      modified_on
    }
  }
`;
export const importFileFunc = async (props) => {
  let rs = null;
  try {
    const { url, data } = props;
    const client = initializeApollo();
    const { data: importData } = await client.mutate({
      mutation: IMPORT_FILE,
      variables: { url, data },
      fetchPolicy: 'no-cache'
      // nextFetchPolicy: 'cache-first'
    });
    if (importData && importData.import_file) {
      rs = {
        id: importData.import_file.id,
        storage: importData.import_file.storage,
        filename_download: importData.import_file.filename_download,
        uploaded_on: importData.import_file.uploaded_on,
        modified_on: importData.import_file.modified_on
      };
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return false;
  }

  return rs;
};

export const DELETE_FILE = gql`
  mutation DeleteFile($fileId: ID!) {
    delete_files_item(id: $fileId) {
      id
    }
  }
`;
export const deleteFileFunc = async (fileId) => {
  let rs = null;
  try {
    const client = initializeApollo();
    const { data } = await client.mutate({
      mutation: DELETE_FILE,
      variables: { fileId },
      fetchPolicy: 'no-cache'
      // nextFetchPolicy: 'cache-first'
    });
    rs = data;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
    return false;
  }

  return rs;
};

export default {
  importFileFunc,
  deleteFileFunc
};
