export const signedFormats = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ods', '.odt', '.rtf', '.txt', 'xlsm'];

export const isSignableDocument = title => {
  const format = title.slice(title.lastIndexOf('.') - title.length).toLowerCase();
  return signedFormats?.includes(format);
};
