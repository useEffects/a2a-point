import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { buildAssetUrl, shortTime } from "app/lib/helpers";
import { getListingsCountForUser } from "app/lib/misc/get-counts";
import { User } from "app/lib/types";
import { Info, LogOut, MessageCircle, Rows2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Link } from "solito/link";
import { Header } from "./header";
import { ExtraSmallListingCardProps } from "./listings-cards/atoms/extra-small";
import { CommonFilters, RenderListings, bodies, commonFilters } from "./listings-cards/molecules/listings";
import { ToggleTheme } from "./toggle-theme";
import { Button } from "./ui/button";
import { TabView, SceneMap, NavigationState, SceneRendererProps } from 'react-native-tab-view';
import { cn } from "app/lib/utils";
import Collapsible from 'react-native-collapsible';
import { directusUrl } from "app/lib/constants";

export default function Profile({ user }: { user: User }) {
    const [index, setIndex] = useState(0)
    const { colors } = useColorScheme()
    const [listingsCount, setListingsCount] = useState<number | null>(0)
    const { width, height } = useWindowDimensions()
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        getListingsCountForUser(user.id).then(setListingsCount)
    }, [user.id])

    const TabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> }) => {
        const index = props.navigationState.index
        const onPress = (i: number) => {
            props.jumpTo(tabTitles[i]!)
        }
        const buttonWidth = width / 2 - 14 - 8
        return <>
            <Header>
                <View className="flex-row gap-8 justify-between flex-1 items-center">
                    <Text className="text-lg">Profile</Text>
                    <View className="flex-row gap-4 items-center">
                        <Button variant="base" size="none">
                            <LogOut size={18} color={colors.foreground} />
                        </Button>
                        <ToggleTheme />
                    </View>
                </View>
            </Header>
            <Collapsible duration={500} collapsed={collapsed}>
                <View className="flex-col gap-8 my-8">
                    <View className="flex-col gap-4 items-center">
                        <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-24 h-24 rounded-full" />
                        <View className="flex-col items-center">
                            <Text className="text-primary font-bold">{user.first_name} {user.last_name}</Text>
                            <Link href={`mailto:${user.email}`}>
                                <Text className="text-info underline">{user.email}</Text>
                            </Link>
                            <Text>{user.location}</Text>
                            <Text className="text-subtext">{user.title}</Text>
                        </View>
                    </View>
                    <View className="flex-row w-full justify-evenly">
                        <View className="flex-col items-center">
                            <Text>{listingsCount}</Text>
                            <Text>Listings</Text>
                        </View>
                        <View className="flex-col items-center">
                            <Text>4.5</Text>
                            <Text>Rating</Text>
                        </View>
                        <View className="flex-col items-center">
                            <Text>{shortTime(user.last_access)}</Text>
                            <Text>Last Seen</Text>
                        </View>
                    </View>
                    <View className="flex-row w-full justify-between px-4">
                        <Button onPress={() => Linking.openURL(`${directusUrl}/admin/users/${user.id}`)} size="none" style={{ width: buttonWidth }} className="py-1">
                            <Text>Open in dashboard</Text>
                        </Button>
                        <Button size="none" style={{ width: buttonWidth }} className="py-1">
                            <Text>Your activity</Text>
                        </Button>
                    </View>
                </View>
            </Collapsible>
            <View className="flex-row justify-between px-4">
                {Array(3).fill(0).map((_, i) => <Button className={cn("w-1/3 border border-0 rounded-none border-primary", i === index && "border-b-[1px] h-12")} key={i} variant={"base"} onPress={() => onPress(i)}>
                    <TabIcons index={i} isActive={i === index} />
                </Button>)}
            </View>
        </>
    }

    const RenderScene = (props: SceneRendererProps & { route: any }) => {
        const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const { nativeEvent } = e;
            if (nativeEvent.contentOffset.y > 0) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        const renderScene = SceneMap({
            info: () => <InfoTab user={user} />,
            listings: () => <ListingTab user={user} />,
            feedbacks: () => <View />,
        });

        return (
            <ScrollView
                onScroll={onScroll}
                onMomentumScrollEnd={onScroll}
                onScrollEndDrag={onScroll}
                scrollEventThrottle={16}
                className="flex-1"
            >
                {renderScene(props)}
            </ScrollView>
        );
    };

    return <TabView
        style={{ height }}
        renderTabBar={TabBar}
        navigationState={{ index, routes: tabTitles.map(title => ({ key: title, title })) }}
        renderScene={(props) => <RenderScene {...props} />}
        onIndexChange={setIndex}
        initialLayout={{ width }}
    />
}

const tabTitles = ["info", "listings", "feedbacks"];

const TabIcons = ({ index, isActive }: { index: number, isActive: boolean }) => {
    const { colors } = useColorScheme()
    const tabIcons = [Info, Rows2, MessageCircle]
    const Icon = tabIcons[index]!
    return <Icon style={{ marginVertical: 4 }} size={18} color={isActive ? colors.primary : colors.foreground} />
}

const InfoTab = ({ user }: { user: User }) => {
    return <View className="p-4 flex-col gap-4">
        {(user.description && user.tags && user.tags.length) ? <View className="flex flex-col gap-4">
            <Text className="text-xl font-bold">Bio</Text>
            <Text>{user.description}</Text>
            <View className="flex-row gap-2">
                {user.tags.map((tag, index) => <Text className="rounded-full border border-solid border-foreground px-2" key={index}>{tag}</Text>)}
            </View>
        </View> : <></>}
        {user.social_media ? <View className="flex-col gap-4">
            <Text className="text-xl font-bold">Social links</Text>
            <View className="flex-row gap-4">
                {user.social_media.map((item, i) =>
                    <View key={i} className="flex flex-row gap-2 items-center">
                        {/* <Feather name={item.social_media.toLowerCase() as any} className="!text-foreground !text-xl" /> */}
                        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                            <Text className="underline">{item.link}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View> : <></>}
        {user.work_experience ? <View className="flex-col gap-4">
            <Text className="text-xl font-bold">Work experience</Text>
            {user.work_experience.map((item, i) => (
                <View key={i} className="flex flex-col gap-2 border border-solid p-4 border-border">
                    <View className="flex-col gap-4">
                        <View className="flex-row items-center gap-4">
                            {item.company_logo && (
                                <Image source={{ uri: item.company_logo }} className="w-16 h-16 rounded" />
                            )}
                            <View className="flex flex-col gap-2 justify-center">
                                <Text>{item.company_name}</Text>
                                <Text>{item.title}</Text>
                            </View>
                        </View>
                        <View className="flex-row gap-4">
                            <View className="flex-row gap-2">
                                {/* <Foundation name="clock" className="!text-foreground" size={24} /> */}
                                <Text>{item.start_date}</Text>
                                <Text>{item.end_date ?? "Present"}</Text>
                            </View>
                            <View className="flex-row gap-2">
                                {/* <Foundation name="map" size={24} className="!text-foreground" /> */}
                                <Text>{item.location}</Text>
                            </View>
                        </View>
                    </View>
                    <Text>{item.description}</Text>
                </View>
            ))}
        </View> : <></>}
    </View>
}

const ListingTab = ({ user }: { user: User }) => {
    return <RenderListings<ExtraSmallListingCardProps>
        render={bodies.extraSmall}
        filterMethod={commonFilters[CommonFilters.User](user.id)}
        flatListProps={{
            scrollEnabled: false,
        }}
    />
}