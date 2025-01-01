import { readItem } from '@directus/sdk';
import { RenderCompanyTileProps } from 'app/components/formComponents';
import { directusStore } from 'app/store/directus';

export const getCompanyFromId = async (
  id: string,
): Promise<RenderCompanyTileProps> => {
  const { rest } = directusStore.getState();

  const res = await rest.request(
    readItem('companies', id, {
      fields: ['id', 'avatar', 'title'],
    }),
  );

  return res as RenderCompanyTileProps;
};
