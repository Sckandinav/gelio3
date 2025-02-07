export const signableFormats = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.ods'];

export const isSignableDocument = title => {
  const format = title.slice(title.lastIndexOf('.') - title.length);
  return signableFormats.includes(format);
};
