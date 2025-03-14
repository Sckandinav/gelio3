export const signedFormats = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ods', '.odt', '.rtf', '.txt', 'xlsm'];

export const isSignableDocument = title => {
  const format = title.slice(title.lastIndexOf('.') - title.length).toLowerCase();
  console.log('signedFormats?.includes(format)', title, signedFormats?.includes(format));
  return signedFormats?.includes(format);
};
