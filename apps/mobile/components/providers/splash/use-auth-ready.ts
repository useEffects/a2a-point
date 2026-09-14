import { useAuthFlow } from 'app/application/auth/hooks';

export const useAuthReady = () => {
  const { isPending } = useAuthFlow();

  return !isPending;
};
