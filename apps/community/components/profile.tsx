import { View, Image, TouchableOpacity, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { buildAssetUrl } from "~/lib/helpers";
import { Feather } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { User } from "~/types";

export default function Profile({ user }: { user: User }) {
    return (
        <View className="container flex-col gap-8 px-2 py-4">
            <View className="flex-row gap-4 items-center">
                <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-36 h-36 rounded-full" />
                <View className="flex-col gap-1">
                    <Text className="text-primary">{user.first_name} {user.last_name}</Text>
                    <Text>{user.email}</Text>
                    <Text>{user.location}</Text>
                    <Text className="text-subtext">{user.title}</Text>
                </View>
            </View>
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
                            <Feather name={item.social_media.toLowerCase() as any} className="!text-foreground !text-xl" />
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
                                    <Foundation name="clock" className="!text-foreground" size={24} />
                                    <Text>{item.start_date}</Text>
                                    <Text>{item.end_date ?? "Present"}</Text>
                                </View>
                                <View className="flex-row gap-2">
                                    <Foundation name="map" size={24} className="!text-foreground" />
                                    <Text>{item.location}</Text>
                                </View>
                            </View>
                        </View>
                        <Text>{item.description}</Text>
                    </View>
                ))}
            </View> : <></>}
        </View>
    );
}