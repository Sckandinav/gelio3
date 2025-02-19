import { useSelector } from 'react-redux';
import { userSelectors } from '../../store/selectors/userSelectors';

export const useUserToken = () => {
  const token = useSelector(userSelectors)?.data?.token;
  return token;
};
