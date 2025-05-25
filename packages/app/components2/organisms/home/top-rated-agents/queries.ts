import { UseQueryOptions } from '@tanstack/react-query';
import { memberRole } from 'app/lib/constants';
import {
  getFeedbacksCountForUser,
  getListingsCountForUser,
  renderCardsQuery2,
} from 'app/lib/misc/queries';
import {
  SmallUsersCardProps,
  smallUsersFields,
  UsersCardMetrics,
} from 'app/lib/props';
import { QueryOptsInstance } from 'app/shared/utils/query-class';

export class CreateTopRatedAgentsQOpts
  implements QueryOptsInstance<SmallUsersCardProps & UsersCardMetrics>
{
  get() {
    return {
      queryKey: ['users', 'small users query'],
      queryFn: ({ pageParam = 0 }) =>
        renderCardsQuery2<SmallUsersCardProps>({
          collection: 'users',
          fields: smallUsersFields,
          filter: {
            role: {
              _eq: memberRole,
            },
          },
          limit: 5,
        }).then((res) =>
          Promise.all(
            res.map(async (user) => {
              const listingsCount = await getListingsCountForUser(user.id);
              const ratingsCount = await getFeedbacksCountForUser(user.id);
              return { ...user, listingsCount, ratingsCount };
            }),
          ),
        ),
    } as UseQueryOptions<(SmallUsersCardProps & UsersCardMetrics)[]>;
  }
}
