import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { wallet_add, spreadsheet_id, sheet_id }
  } = req;

  const rs = {
    is_whitelisted: false
  };

  switch (method) {
    case 'GET':
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
        const sheetId = parseInt(sheet_id as string);
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

      res.status(200).json(rs);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
