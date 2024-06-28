import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "app/components/cards/atoms/news";
import { PhotoListingProps } from "app/components/cards/atoms/photo";
import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { SmallUsersCardProps } from "app/components/cards/atoms/users";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { SmallLocationCards } from "app/components/cards/molecules/locations";
import { RenderUsers, Mode as UsersRenderMode } from "app/components/cards/molecules/users";
import { CompanyStats } from "app/components/company-stats";
import { ArrowUpRight, ExternalLink } from "app/components/icons";
import { SeparatorText } from "app/components/separator-text";
import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import { ViewAllButton } from "app/components/utils/common-ui";
import { FlatList, ScrollView } from "app/components/utils/virtual-lists";
import { useColorScheme } from "app/hooks/color-scheme";
import { directusUrl, portfolioUrl } from "app/lib/constants";
import { News } from "app/lib/types";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import * as Linking from "expo-linking";
import opacity from "hex-color-opacity";
import { View } from "react-native";
import { Link } from "solito/link";
import { FilterKeys, FilterParam } from "./listings";
import useRouting from "app/hooks/use-routing";
import { Header } from "app/components/header";

export default function HomeScreen() {
    const { authenticated, token } = directusStore()
    const { user } = userStore()
    const { colors } = useColorScheme()
    const { rest } = directusStore()
    const goToListings = useRouting("listings")

    const { data: news } = useQuery<News[]>({
        queryKey: ["Fetch news"],
        queryFn: async () => await rest.request(readItems("news", {
            limit: 10,
        })) as News[],
        initialData: []
    })

    return <ScrollView contentContainerClassName="flex-grow flex-col gap-8 pb-8">
        <Header>
            <Text className="text-xl font-bold">A2APoint</Text>
        </Header>
        <Text className="text-2xl font-bold text-wrap px-4">{authenticated ? `Welcome back ${user.first_name} ${user.last_name}` : "The one stop for all agents"}</Text>
        <RenderListings<PhotoListingProps>
            render={bodies.photo}
            filter={commonFilters[CommonFilters.Photo]()}
            flatListProps={{
                horizontal: true,
                showsHorizontalScrollIndicator: false,
                ListHeaderComponent: () => <View className="w-4 h-4" />
            }}
        />
        <CompanyStats className="justify-start gap-12 px-4" />
        <SeparatorText hideRight>
            <Button onPress={() => goToListings([{
                [FilterKeys.Premium]: CommonFilters.Premium
            }] as FilterParam[])} variant={"base"} size={"none"} className="flex-row px-4 gap-1 items-center w-60 ml-auto mr-0">
                <Text className="text-right text-subtext">Premium listings curated by A2APoint</Text>
                <ArrowUpRight size={24} className="text-info" />
            </Button>
        </SeparatorText>
        <RenderListings<SmallListingCardProps>
            render={bodies.small}
            flatListProps={{
                horizontal: true,
                ListHeaderComponent: () => <View className="w-4 h-4" />
            }}
            filter={commonFilters[CommonFilters.Premium]()}
            paramFilter={[{ [FilterKeys.Premium]: CommonFilters.Premium }]}
        />
        <SeparatorText hideLeft wrapperClassName="px-4">
            <Text className="font-medium">Browse popular locations</Text>
        </SeparatorText>
        <SmallLocationCards />
        <SeparatorText hideLeft wrapperClassName="px-4">
            <Text className="font-medium">Top rated agents</Text>
        </SeparatorText>
        <RenderUsers<SmallUsersCardProps>
            mode={UsersRenderMode.small}
            limit={5}
            sort={["score"]}
            flatListProps={{
                horizontal: true,
                ListHeaderComponent: () => <View className="w-4 h-4" />
            }}
        />
        <SeparatorText hideLeft wrapperClassName="px-4">
            <Text className="font-medium">News and feeds</Text>
        </SeparatorText>
        <FlatList
            data={news}
            renderItem={({ item }) => <NewsCard news={item} />}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4 h-4" />}
            ListFooterComponent={() => <ViewAllButton horizontal button={(props) => <Button {...props} onPress={() => Linking.openURL(`${portfolioUrl}/news`)} />} />}
            ListHeaderComponent={() => <View className="w-4 h-4" />}
        />
        <SeparatorText hideLeft wrapperClassName="px-4">
            <Text className="font-medium">Quick links</Text>
        </SeparatorText>
        <View className="flex-row justify-between px-4">
            {externalLinks.map(({ label, href }, index) => <Link key={index} href={href} className="">
                <Button variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.info, 0.1) }} className="flex-row gap-1 py-1 px-2 rounded">
                    <Text className="text-info">{label}</Text>
                    <ExternalLink size={18} className="text-info" />
                </Button>
            </Link>)}
        </View>
    </ScrollView>
}

const externalLinks = [
    {
        label: "Website",
        href: portfolioUrl
    },
    {
        label: "Dashboard",
        href: directusUrl
    },
    {
        label: "Courses",
        href: `${directusUrl}/courses`
    },
    {
        label: "News",
        href: `${directusUrl}/news`
    }
]