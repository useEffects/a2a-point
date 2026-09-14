import type { Preview } from '@storybook/nextjs';
import { RouterProvider } from 'app/components2/providers/router/index.web.tsx';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <RouterProvider>
          <Story />
        </RouterProvider>
      </>
    ),
  ],
};

export default preview;
