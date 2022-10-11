import React, { useEffect } from 'react';
import { shape, string } from 'prop-types';
import classes from './uploader.module.css';
import { useTranslation } from 'next-i18next';
import Uppy from '@uppy/core';
import { DragDrop, useUppy } from '@uppy/react';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { ellipsify } from '../../../utils/strUtils';
import { formatBytes } from '../../../utils/numberUtils';
import BrowserPersistence from '../../../utils/simplePersistence';
import {
  importFileFunc,
  deleteFileFunc
} from '../../../hooks/Uploader/api.gql';

const Uploader = (props) => {
  const {
    id = 'upload-files',
    storageKeyName = 'uploadedFiles',
    uploaderContainerId = 'uploader-container',
    previewContainerId = 'preview-container',
    allowedFileTypes = [
      'image/*',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.pdf',
      '.zip',
      '.gz',
      '.tar.gz'
    ],
    allowMultipleFiles = true,
    maxNumberOfFiles = 5,
    maxFileSize = 3000000, // 3M
    minFileSize = 1024, //1KB
    /**
     * Example with parent folder:
     * {
            id: '39561e14-335c-4f11-b6bb-33a9814c67e0',
            name: 'attachments',
            parent: {
              id: '9eb6ae9d-acce-4b44-ab23-2b660fb48e01',
              name: 'job'
            }
          }
     */
    storageFolder = {
      id: '39561e14-335c-4f11-b6bb-33a9814c67e0',
      name: 'attachments',
      parent: {
        id: '9eb6ae9d-acce-4b44-ab23-2b660fb48e01',
        name: 'job'
      }
    },

    // tusUploadEndpoint = 'http://127.0.0.1:8585',
    tusUploadEndpoint = 'https://tusd.tusdemo.net/files/'
  } = props;

  const { t } = useTranslation('uploader');
  const storage = new BrowserPersistence();

  const setUploadingState = () => {
    const uploaderContainer = document.getElementById(uploaderContainerId);
    uploaderContainer.className = uploaderContainer.className + ' uploading';
  };

  const cleanUploadingState = () => {
    setTimeout(function () {
      const uploaderContainer = document.getElementById(uploaderContainerId);
      uploaderContainer.className = uploaderContainer.className.replace(
        'loading',
        ''
      );
    }, 1000);
  };

  const importFiles = (files) => {
    let uploadedFiles = storage.getItem(storageKeyName);
    if (uploadedFiles === undefined) {
      uploadedFiles = [];
    }
    files.map(async (file, key) => {
      const found = uploadedFiles.some((el) => el.id === file.id);
      if (!found) {
        // Import to Directus file
        const directUsFile = await importFileFunc({
          url: file.uploadURL,
          data: {
            title: file.name,
            type: file.type,
            storage: 'local',
            folder: storageFolder,
            filename_download: file.name,
            uploaded_on: new Date(),
            modified_on: new Date()
          }
        });
        if (directUsFile) {
          file.directus_file = directUsFile;
          uploadedFiles[key] = file;
          //save to local storage
          storage.setItem(storageKeyName, uploadedFiles, 24 * 60 * 60); // 1 day
        }
      }
    });
  };

  const generatePreview = () => {
    const uploadedFiles = storage.getItem(storageKeyName);
    if (uploadedFiles) {
      uploadedFiles.map((file) => {
        if (!document.getElementById(file.id)) {
          // preview item
          const item = document.createElement('li');
          item.id = file.id;
          item.className = classes.previewItem;

          if (/(jpe?g|png|gif|bmp)$/i.test(file.extension)) {
            // create thumb
            const img = new Image();
            img.alt = file.name;
            img.src = file.uploadURL;
            img.className = classes.previewImage;
            item.appendChild(img);
          }

          // create file name with link
          const fileLink = document.createElement('a');
          // fileLink.href = file.uploadURL;
          // fileLink.target = '_blank';
          fileLink.className = classes.fileUploaded;
          const fileLinkText = document.createTextNode(
            ellipsify({ str: file.name, start: 5, end: 4 })
          );
          const fileSizeText = document.createTextNode(
            ', ' + formatBytes(file.size)
          );
          fileLink.appendChild(fileLinkText);
          fileLink.appendChild(fileSizeText);
          item.appendChild(fileLink);

          // create remove button
          if (item.id) {
            const rmBtn = document.createElement('span');
            rmBtn.className = classes.btnRemove;
            const rmBtnText = document.createTextNode(t('Remove'));
            rmBtn.appendChild(rmBtnText);

            rmBtn.onclick = async (e) => {
              // remove file from uppy
              uppy.removeFile(file.id);

              // remove file from local storage
              if (uploadedFiles) {
                const newFiles = uploadedFiles.filter((obj) => {
                  return obj.id !== file.id;
                });
                storage.setItem(storageKeyName, newFiles);
              }

              if (file.directus_file_id) {
                await deleteFileFunc(file.directus_file_id);
              }

              //clean preview element on DOM
              document.getElementById(file.id).remove();
            };

            item.appendChild(rmBtn);
          }
          document.getElementById(previewContainerId).appendChild(item);
        }
      });
    }
  };

  let uppy = `uppy_${id}`;
  uppy = useUppy(() => {
    return new Uppy({
      id,
      debug: true,
      autoProceed: true,
      allowMultipleUploadBatches: allowMultipleFiles,
      restrictions: {
        allowedFileTypes,
        maxNumberOfFiles,
        maxFileSize,
        minFileSize
      }
    }).use(Tus, {
      endpoint: tusUploadEndpoint,
      onError(error) {
        console.log('Failed because: ' + error);
      }
    });
  });
  uppy.on('upload', (data) => {
    setUploadingState();
  });
  uppy.on('complete', (result) => {
    const uploadedFiles = result.successful.length ? result.successful : [];
    if (uploadedFiles.length) {
      // Import uploaded files
      importFiles(uploadedFiles);
      // Generate preview
      setTimeout(() => {
        generatePreview();
      }, 1000);
    }
    cleanUploadingState();
  });

  useEffect(() => {
    //refresh local storage
    storage.removeItem(storageKeyName);
  }, []);

  useEffect(() => {
    return () => {
      uppy.reset();
      uppy.close({ reason: 'unmount' });
    };
  }, [uppy]);

  const typesAllowed = `${t('Allows file types:')} ${allowedFileTypes.join(
    ', '
  )}`;
  const sizeAllowed = `${t('Allows file size:')} ${formatBytes(
    minFileSize
  )} - ${formatBytes(maxFileSize)}`;
  const child = (
    <div id={uploaderContainerId} className={`${classes.uploaderContainer}`}>
      <DragDrop
        uppy={uppy}
        allowMultipleFiles={allowMultipleFiles}
        locale={{
          strings: {
            dropHereOr: t('Drag and drop file here or click to %{browse}'),
            browse: t('browse')
          }
        }}
        note={`${typesAllowed} | ${sizeAllowed}`}
      />
      <ul id={previewContainerId} className={`${classes.previewContainer}`} />
    </div>
  );

  return <div className={`${classes.root}`}>{child}</div>;
};

Uploader.propTypes = {
  classes: shape({
    root: string
  })
};

export default Uploader;
