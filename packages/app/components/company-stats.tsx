import { cn } from 'app/lib/utils';
import { View } from 'react-native';
import { Text } from './ui/text';
import {
  ArrowUpRight,
  Building2,
  MapPin,
  TrendingUp,
  Users,
} from 'app/components/icons';
import { groupByN } from 'app/lib/helpers';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useQuery } from '@tanstack/react-query';
import { companyStatsQuery } from 'app/screens/home/queries';
import { Skeleton } from './skeleton';
import { isObjectLike } from 'lodash';
import { Button } from './ui/button';
import { useRouter } from 'app/context/router';

export const CompanyStats = ({
  className,
  right,
}: {
  className?: string;
  right?: boolean;
}) => {
  const { colors } = useColorScheme();
  const { data: counts, isLoading } = useQuery(companyStatsQuery);
  const router = useRouter();

  const stats = [
    {
      title: 'Listings',
      count: counts!.listingsCount,
      icon: TrendingUp,
      viewAll: '/listings',
    },
    {
      title: 'Agents',
      count: counts!.usersCount,
      icon: Users,
      viewAll: '/agents',
    },
    {
      title: 'Companies',
      count: counts!.companiesCount,
      icon: Building2,
    },
    {
      title: 'Locations',
      count: counts!.locationsCount,
      icon: MapPin,
      viewAll: '/locations',
    },
  ];

  return (
    <View className={cn('flex-col w-full gap-4', className)}>
      {groupByN(stats).map((group, i) => (
        <View key={i} className="flex-row gap-4 w-full">
          {group.map(({ title, count, icon, viewAll }, j) => {
            const Icon = icon;
            return isLoading ? (
              <Skeleton
                key={j}
                className="flex-grow h-32 border-[1px] border-solid border-border rounded-xl"
              />
            ) : (
              <View
                key={j}
                className="flex-grow bg-card border-[1px] border-solid border-border rounded-xl p-4 h-32 flex-row"
              >
                <View className="flex-col flex-1 justify-center">
                  <View
                    className={cn(
                      'flex-row items-end gap-1',
                      right && 'justify-end',
                    )}
                  >
                    <Text className="text-6xl font-bold">{count}</Text>
                    <Text className="text-2xl font-bold mb-1">+</Text>
                  </View>
                  <View
                    className={cn(
                      'flex-row items-center gap-2',
                      right && 'justify-end',
                    )}
                  >
                    <Icon size={18} color={colors.subtext} />
                    <Text className="text-subtext">{title}</Text>
                  </View>
                </View>
                {viewAll ? (
                  <Button
                    variant={'base'}
                    size={'icon'}
                    className="rounded-full mt-auto mb-0 !bg-transparent border-info border-[1px] border-solid"
                    onPress={() => router.push(viewAll)}
                  >
                    <ArrowUpRight color={colors.info} />
                  </Button>
                ) : (
                  <Button
                    variant={'base'}
                    size={'icon'}
                    className="rounded-full mt-auto mb-0 opacity-0"
                    disabled
                  ></Button>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
