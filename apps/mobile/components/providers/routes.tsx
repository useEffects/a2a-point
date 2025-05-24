import { Stack } from 'expo-router';

const ROUTES = [
  '(main)',
  'account-console',
  'agents/[id]',
  'agents/index',
  'agents/me/activity',
  'agents/me/notifications',
  'agents/feedbacks/[agent]',
  'chat/[id]',
  'listings/[id]',
  'listings/post',
  'locations/[...slug]',
  'locations/index',
  'auth/login',
  'auth/callback',
];

export const StackScreens = () => {
  return (
    <Stack>
      {ROUTES.map((route) => (
        <Stack.Screen name={route} key={route} />
      ))}
    </Stack>
  );
};
