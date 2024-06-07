import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "app/components/cards/atoms/news";
import { PhotoListingProps } from "app/components/cards/atoms/photo";
import { SmallListingCardProps } from "app/components/cards/atoms/small";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { ArrowUpRight, ExternalLink } from "app/components/icons";
import { SmallLocationCards } from "app/components/cards/molecules/locations";
import { SeparatorText } from "app/components/separator-text";
import { Button } from "app/components/ui/button";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { directusUrl, portfolioUrl } from "app/lib/constants";
import { News } from "app/lib/types";
import directusStore from "app/store/directus";
import userStore from "app/store/user";
import opacity from "hex-color-opacity";
import { Dimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "solito/link";
import { FlatList } from "app/components/utils/virtual-lists";
import { SmallUsersCard, SmallUsersCardProps, smallUsersFields } from "app/components/cards/atoms/users";

export default function HomeScreen() {
    const { authenticated, token } = directusStore()
    const { user } = userStore()
    const { colors } = useColorScheme()
    const { rest } = directusStore()

    const { data: news } = useQuery<News[]>({
        queryKey: ["Fetch news"],
        queryFn: async () => await rest.request(readItems("news", {
            limit: 10,
        })) as News[],
        initialData: []
    })

    const { data: users } = useQuery<SmallUsersCardProps[]>({
        queryKey: ["Fetch top agents"],
        queryFn: async () => await fetch(`${directusUrl}/users/?fields=${smallUsersFields.join(",")}&sort=score&limit=5`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as SmallUsersCardProps[],
        initialData: []
    })

    return <View className="flex-1 flex-col gap-8">
        <Text className="text-2xl font-bold text-wrap">{authenticated ? `Welcome back ${user.first_name} ${user.last_name}` : "The one stop for all agents"}</Text>
        <RenderListings<PhotoListingProps>
            render={bodies.photo}
            filterMethod={commonFilters[CommonFilters.Photo]()}
            flatListProps={{
                horizontal: true,
                showsHorizontalScrollIndicator: false,
            }}
        />
        <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center w-40 ml-auto mr-0">
            <Text className="text-right text-subtext">Premium listings curated by A2APoint</Text>
            <ArrowUpRight size={24} className="text-info" />
        </Button>
        <RenderListings<SmallListingCardProps>
            render={bodies.small}
            flatListProps={{
                horizontal: true,
            }}
        />
        <SeparatorText hideLeft>
            <Text className="font-medium">Browse popular locations</Text>
        </SeparatorText>
        <SmallLocationCards />
        <SeparatorText hideLeft>
            <Text className="font-medium">Top rated agents</Text>
        </SeparatorText>
        <FlatList
            data={users}
            renderItem={({ item }) => <SmallUsersCard {...item} />}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        />
        <SeparatorText hideLeft>
            <Text className="font-medium">News and feeds</Text>
        </SeparatorText>
        <FlatList
            data={news}
            renderItem={({ item }) => <NewsCard news={item} />}
            horizontal
            ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        />
        <SeparatorText hideLeft>
            <Text className="font-medium">Quick links</Text>
        </SeparatorText>
        <View className="flex-row justify-between">
            {externalLinks.map(({ label, href }, index) => <Link key={index} href={href} className="">
                <Button variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.info, 0.1) }} className="flex-row gap-1 py-1 px-2 rounded">
                    <Text className="text-info">{label}</Text>
                    <ExternalLink size={18} className="text-info" />
                </Button>
            </Link>)}
        </View>
    </View >
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