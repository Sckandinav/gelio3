export const surnameFormatter = str => {
  const [surname, name, patronymic] = str.split(' ');
  return `${surname} ${name[0]}.${patronymic ? patronymic[0] : ''}`;
};
