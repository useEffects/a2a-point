import {
  FormAutoSelect,
  RenderCompanyTileProps,
} from 'app/components/formComponents';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { portfolioUrl } from 'app/lib/constants';
import { getCompanyFromId } from 'app/lib/misc/from-id';
import userStore from 'app/store/user';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CompanySelectScreen = () => {
  const { user } = userStore();
  const [company, setCompany] = useState<RenderCompanyTileProps | null>(null);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const shouldShowSetCompany = user.company !== company?.id;

  const handleUpdateCompany = async () => {
    setLoading(true);
    fetch(`${portfolioUrl}/api/account-console/company`, {
      method: 'PATCH',
      body: JSON.stringify({
        user: user.id,
        company: company!.id,
      }),
    }).then(() => {
      setLoading(false);
      userStore.setState((p) => ({
        ...p,
        user: { ...p.user, company: company!.id },
      }));
    });
  };

  useEffect(() => {
    if (user.company) {
      getCompanyFromId(user.company).then((c) => {
        setCompany(c);
        setKey((p) => p + 1);
      });
    }
  }, []);

  const handleRemoveCompany = () => {
    setLoading(true);
    setCompany(null);
    setKey((p) => p + 1);
    fetch(`${portfolioUrl}/api/account-console/company`, {
      method: 'PATCH',
      body: JSON.stringify({
        user: user.id,
        company: '',
      }),
    }).then(() => {
      setLoading(false);
      userStore.setState((p) => ({
        ...p,
        user: { ...p.user, company: '' },
        company: undefined,
      }));
    });
  };

  return (
    <View className="flex-col gap-12 flex-1">
      <View className="flex-col gap-12 flex-grow p-4">
        <View className="flex-col gap-2">
          <Text className="text-xl text-primary">Choose your company</Text>
          <Text>
            Connect with other real estate agents to collaborate and close deals
            faster.
          </Text>
        </View>
        <View className="flex-col gap-2">
          <FormAutoSelect
            key={key}
            currentItem={company}
            setCurrentItem={(val) =>
              setCompany(val as RenderCompanyTileProps | null)
            }
            item="companies"
            label="Company Name (Optional)"
            placeholder="Search for your company"
          />
          <Text className="text-subtext">
            Leave it blank, if you would like to continue as an individual agent
          </Text>
          <Text className="text-info text-sm">
            Feel free to contact admin if your company is not in the list
          </Text>
        </View>
        <View className="mt-auto mb-0">
          {shouldShowSetCompany ? (
            loading ? (
              <></>
            ) : (
              <Button onPress={handleUpdateCompany}>
                <Text>Set company</Text>
              </Button>
            )
          ) : (
            <View className="flex-col gap-2">
              <Text className="text-destructive text-center">
                proceed as individual agent
              </Text>
              {loading ? (
                <></>
              ) : (
                <Button onPress={handleRemoveCompany} variant={'destructive'}>
                  <Text>Remove company</Text>
                </Button>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export const CompanySelectScreenHeader = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Header height={'auto'}>
      <View
        style={{ paddingTop: top + 16 }}
        className="flex-row items-center pb-4 flex-1"
      >
        <View className="h-12 flex-row items-center gap-4">
          <BackButton />
          <HeaderTitle>Company</HeaderTitle>
        </View>
      </View>
    </Header>
  );
};
