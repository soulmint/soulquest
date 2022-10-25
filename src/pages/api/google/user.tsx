import { NextApiRequest, NextApiResponse } from 'next';

const { GoogleSpreadsheet } = require('google-spreadsheet');

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { task, spreadsheet_id, sheet_id, wallet_add } = req.query;
    const rs = {
      is_whitelisted: false
    };

    switch (task) {
      case 'is_whitelisted':
        if (spreadsheet_id && sheet_id && wallet_add) {
          // Init G-doc
          const doc = new GoogleSpreadsheet(spreadsheet_id);
          // Init Auth
          await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SHEET_SERVICE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEET_SERVICE_PRIVATE_KEY
          });
          // Loads doc
          await doc.loadInfo();

          // Load whitelist sheet
          const sheetId = parseInt(sheet_id);
          const sheet = doc.sheetsById[sheetId];

          const rows = await sheet.getRows();
          for (const row of rows) {
            const add = row.wallet_address ? row.wallet_address : null;
            if (add === wallet_add) {
              rs.is_whitelisted = true;
              break;
            }
          }
        }
        break;

      default:
        break;
    }

    return res.status(200).json({
      result: rs
    });
  } catch (error) {
    // return error;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Google > Check whitelist: ', error);
    }
    return res.status(500).send({ error });
  }
};
