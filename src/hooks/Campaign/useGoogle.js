const isWhitelisted = async (props) => {
  const { spreadsheet_id, sheet_id, wallet_address } = props;
  let isWhitelisted = false;

  await fetch(
    `/api/ck-whitelist/${wallet_address}?spreadsheet_id=${spreadsheet_id}&sheet_id=${sheet_id}`
  )
    .then((res) => res.json())
    .then((res) => {
      isWhitelisted = res?.is_whitelisted;
    });

  return isWhitelisted;
};

export { isWhitelisted };
