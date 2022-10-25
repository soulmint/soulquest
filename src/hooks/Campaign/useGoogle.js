const isWhitelisted = async (props) => {
  const { spreadsheet_id, sheet_id, wallet_address } = props;
  let isWhitelisted = false;

  await fetch(
    `/api/google/user?task=is_whitelisted&spreadsheet_id=${spreadsheet_id}&sheet_id=${sheet_id}&wallet_add=${wallet_address}`
  )
    .then((res) => res.json())
    .then((data) => {
      isWhitelisted = data && data.result?.is_whitelisted;
    });

  return isWhitelisted;
};

export { isWhitelisted };
