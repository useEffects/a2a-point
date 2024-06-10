import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { Bookmark, Eye } from "app/components/icons";
import { Button } from "app/components/ui/button";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { savedByMeUrl, viewedByMeUrl } from "app/lib/constants";
import { cn } from "app/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { NavigationState, Route, SceneMap, SceneRendererProps, TabView } from "react-native-tab-view";

export default function ActivityScreenComponent() {
    const [navigationState, setNavigationState] = useState<NavigationState<Route>>({
        index: 0,
        routes: [
            { key: "viewed" },
            { key: "saved" }
        ]
    })
    return <TabView
        renderTabBar={props => <TabBar {...props} navigationState={navigationState} />}
        navigationState={navigationState}
        onIndexChange={index => setNavigationState({ ...navigationState, index })}
        renderScene={SceneMap({
            viewed: RenderViewed,
            saved: RenderSaved
        })}
    />
}

const RenderViewed = () => <RenderListings
    render={bodies.medium}
    filter={commonFilters[CommonFilters.ViewedByMe]()}
    noAds
    flatListProps={{
        contentContainerClassName: "px-4",
        ItemSeparatorComponent: () => <Separator className="my-4" />
    }}
    viewAllButtonLink={viewedByMeUrl}
/>

const RenderSaved = () => <RenderListings
    render={bodies.medium}
    filter={commonFilters[CommonFilters.SavedByMe]()}
    noAds
    flatListProps={{
        contentContainerClassName: "px-4",
        ItemSeparatorComponent: () => <Separator className="my-4" />
    }}
    viewAllButtonLink={savedByMeUrl}
/>

const TabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    const map: {
        [k: string]: {
            label: string,
            Icon: LucideIcon
        }
    } = {
        "viewed": {
            label: "Viewed",
            Icon: Eye
        },
        "saved": {
            label: "Saved",
            Icon: Bookmark
        }
    }

    return <View className="flex-row w-full items-center h-24">
        {props.navigationState.routes.map((route, index) => {
            const { label, Icon } = map[route.key]!
            return <View key={index} className="flex-1">
                <Button variant={"base"} size={"none"} className={cn("border-0 pb-4", index === props.navigationState.index && "border-b-[1px] border-primary")} onPress={() => props.jumpTo(route.key)}>
                    <Icon size={18} className={cn(index === props.navigationState.index ? "text-primary" : "text-foreground")} />
                    <Text className={cn(index === props.navigationState.index ? "text-primary" : "text-foreground")}>{label}</Text>
                </Button>
            </View>
        })}
    </View>
}