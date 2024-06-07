/* eslint-disable react/no-children-prop */
import { FullWidthImage } from "app/components/full-width-image"
import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { UserChip } from "app/components/user-chip"
import { useColorScheme } from "app/hooks/color-scheme"
import { useUserDetails } from "app/hooks/user-details"
import { buildAssetUrl, timeAgo } from "app/lib/helpers"
import { News } from "app/lib/types"
import { cn } from "app/lib/utils"
import opacity from "hex-color-opacity"
import { ReactNode } from "react"
import { Dimensions, Image, Platform, View } from "react-native"
import * as Linking from "expo-linking"
import { portfolioUrl } from "app/lib/constants"
import { Link } from "solito/link"

export const NewsCard = ({ news, isFirst }: { news: News, isFirst?: boolean }) => {
    const isNative = Platform.OS !== "web"
    const userCreated = useUserDetails(news.user_created)
    const windowWidth = Dimensions.get("window").width
    const { colors } = useColorScheme()
    const Component = isNative ?
        ({ children }: { children: ReactNode }) => <Button
            children={children}
            variant={"base"}
            size={"none"}
            onPress={() => Linking.openURL(`${portfolioUrl}/news/${news.id}`)}
        /> :
        ({ children }: { children: ReactNode }) => <View children={children} />

    return <Component>
        <View style={{ width: isNative ? windowWidth * 0.5 : undefined }} className={cn(isFirst ? "flex-row" : "flex-col", "")}>
            <View className={cn(isFirst ? "w-1/2" : "w-full")}>
                <Image className={cn(isFirst ? "h-[600px]" : isNative ? "h-[200px]" : "h-[300px]", "rounded-tl-xl rounded-tr-xl")} source={{ uri: buildAssetUrl(news.cover_image) }} />
            </View>
            <View className={cn("bg-card p-4 rounded-bl-xl rounded-br-xl", isFirst ? "w-1/2 self-center bg-transparent max-w-sm mx-auto" : "w-full", "p-4 flex-col items-start", isNative ? "gap-1" : "gap-4")}>
                <View className="flex-row justify-between w-full">
                    <Text className="text-info">{news.read_time}</Text>
                    <Text className="text-subtext text-sm">{timeAgo.format(new Date(news.date_created))}</Text>
                </View>
                <Text className="text-lg font-medium">{news.title}</Text>
                {!isNative && <>
                    {userCreated && <UserChip user={userCreated} />}
                    <View className="flex-row flex-wrap gap-4">
                        {news.categories?.map((category, i) => <View style={{ backgroundColor: opacity(colors.primary, 0.1) }} className="rounded px-2 py-1 text-sm" key={i}>
                            <Text className="text-primary">{category.news_categories_id.name}</Text>
                        </View>)}
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                        {news.tags?.map((tag, i) => <View className="border-info border rounded-xl p-1 text-sm" key={i}>
                            <Text className="text-info text-sm">{tag}</Text>
                        </View>)}
                    </View>
                    <Text className="text-subtext">{news.description}</Text>
                    <Link href={`/news/${news.id}`}>
                        <Button>
                            <Text>Read More</Text>
                        </Button>
                    </Link>
                </>}
            </View>
        </View>
    </Component>
}