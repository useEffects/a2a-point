import { createItem, readItems } from "@directus/sdk";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheet, SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import { FlatList, Image, Platform, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Hr } from "~/components/ui/hr";
import { Text } from "~/components/ui/text";
import { buildAssetUrl, combineUUIDs } from "~/lib/helpers";
import { cn } from "~/lib/utils";
import directusStore from "~/store/directus";
import { Listing, User } from "~/types";
import { useDebounce } from 'use-debounce';
import userStore from "~/store/user";
import { queryClient } from "~/index";
import { useColorScheme } from "~/lib/useColorScheme";

const getDMRoomId = async (
  [userId1, userId2]: [string, string],
) => {
  const { rest } = directusStore.getState()
  const rooms = await queryClient.fetchQuery({
    queryKey: ["Fetch Room"],
    queryFn: async () => await rest.request(readItems("rooms", {
      filter: {
        isGroup: false,
        _or: [
          {
            _and: [
              {
                user_created: {
                  id: {
                    _eq: userId1
                  }
                }
              },
              {
                members: {
                  directus_users_id: {
                    id: {
                      _eq: userId2
                    }
                  }
                }
              }
            ]
          },
          {
            _and: [
              {
                user_created: {
                  id: {
                    _eq: userId2
                  }
                }
              },
              {
                members: {
                  directus_users_id: {
                    id: {
                      _eq: userId1
                    }
                  }
                }
              }
            ]
          }
        ]
      },
      fields: ["id"]
    }))
  })
  if (!rooms.length) {
    const room = await queryClient.fetchQuery({
      queryKey: ["Create Room"],
      queryFn: async () => await rest.request(createItem("rooms", {
        isGroup: false,
        members: [
          {
            directus_users_id: userId1
          }, {
            directus_users_id: userId2
          }
        ]
      }, {
        fields: ["id"]
      }
      ))
    })
    return room.id as string
  } else {
    return rooms[0].id as string;
  }
};

type ListingDetailed = Listing & { user_created: User };

const ListingIconTile = ({
  icon,
  text,
  value,
}: {
  icon: ReactNode;
  text: string;
  value: number;
}) => {
  return (
    <View>
      <View className="flex-row gap-2 items-center">
        {icon}
        <Text className="font-bold">{value}</Text>
      </View>
      <Text className="font-light text-muted-foreground">{text}</Text>
    </View>
  );
};

const ListingCard = (props: ListingDetailed) => {
  const { user } = userStore()
  const { colors } = useColorScheme()

  const handleClickToChat = async ([currentUserId, postCreatorId]: [
    string,
    string,
  ]) => {
    const roomId = await getDMRoomId(
      [currentUserId, postCreatorId],
    );
    router.navigate(`/chat/${roomId}`);
  };

  return (
    <View className="w-full px-4 py-6 flex flex-col gap-3 [&>*]:my-0 border-solid border-[1px] border-border rounded">
      <Text className="text-2xl font-extrabold">{props.title}</Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons size={18} color={colors.foreground} name="location-pin" />
          <Text className="text-muted-foreground">{props.location}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialIcons size={18} color={colors.foreground} name="calendar-month" />
          <Text className="text-muted-foreground">
            {new Date(props.date_created).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row gap-4">
          {props.tags.map((tag, i) => (
            <Text
              key={i}
              className="bg-primary px-1 rounded text-primary-foreground w-auto text-sm">
              {tag}
            </Text>
          ))}
        </View>
        <Text className="bg-primary px-1 rounded text-primary-foreground w-auto text-sm">
          For {props.type}
        </Text>
      </View>
      <View className="flex-row gap-4 items-center">
        <Text className="text-primary font-extrabold text-xl">
          AED {Number(props.price).toLocaleString()}
        </Text>
        <Text className="border-solid border-[1px] border-border rounded-full px-1 text-sm">
          {props.mode_of_payment}
        </Text>
        <View className="flex flex-row gap-2 items-center border-solid border-[1px] border-border rounded-full px-2">
          <Text className="text-muted-foreground text-sm font-light">
            Expected fee
          </Text>
          <Text className="text-sm">
            {Number(props.expected_broker_fees).toLocaleString()} %
          </Text>
        </View>
      </View>
      <Hr />
      <Text className="text-xl font-extrabold">
        {Number(props.carpet_area).toLocaleString()} sq ft
      </Text>
      <View className="flex flex-row justify-between">
        {props.bedrooms && (
          <ListingIconTile
            icon={<MaterialIcons name="bed" size={18} color={"white"} />}
            text="Beds"
            value={props.bedrooms}
          />
        )}
        {props.bathrooms && (
          <ListingIconTile
            icon={<MaterialIcons name="bathtub" size={18} color={"white"} />}
            text="Baths"
            value={props.bathrooms}
          />
        )}
        {props.garages && (
          <ListingIconTile
            icon={<MaterialIcons name="garage" size={18} color={"white"} />}
            text="Garages"
            value={props.garages}
          />
        )}
        {props.floors && (
          <ListingIconTile
            icon={<MaterialIcons name="stairs" size={18} color={"white"} />}
            text="Floors"
            value={props.floors}
          />
        )}
      </View>
      <Hr />
      <View className="flex-row justify-between items-center">
        {user?.id !== props.user_created.id ? (
          <Button
            onPress={() =>
              handleClickToChat([user?.id!, props.user_created.id])
            }
            variant="outline">
            <Text> Chat </Text>
          </Button>
        ) : (
          <View />
        )}
        <View className="flex-row gap-4 justify-start items-center">
          <Image
            className="w-8 h-8 rounded-full"
            source={{
              uri: buildAssetUrl(
                props.user_created.avatar,
              ),
            }}
          />
          <Text className="">{props.user_created.first_name}</Text>
        </View>
      </View>
    </View>
  );
};

const ListHeaderComponent = ({
  showLoading,
  value,
  onChangeText,
}: {
  showLoading: boolean;
  value: string;
  onChangeText: (val: string) => void;
}) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const { colors } = useColorScheme()

  return (
    <View className="flex-row items-center w-full">
      <SearchBar
        placeholder="Search ..."
        showLoading={showLoading}
        round={true}
        containerStyle={{ backgroundColor: "transparent", flexGrow: 1 }}
        inputContainerStyle={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 9999,
          borderBottomWidth: 1,
        }}
        inputStyle={{ color: "white" }}
        value={value}
        onChangeText={onChangeText}
        className="outline-none"
      />
      <Ionicons
        onPress={() => setBottomSheetVisible(!bottomSheetVisible)}
        name={"filter-outline"}
        size={24}
        className="!text-foreground mx-4"
      />
      <BottomSheet isVisible={bottomSheetVisible}>
        <View className="bg-background p-4 rounded">
          <View className="flex-row justify-between">
            <Text>Filter listings</Text>
            <Ionicons
              onPress={() => setBottomSheetVisible(!bottomSheetVisible)}
              name={bottomSheetVisible ? "close-outline" : "filter-outline"}
              size={24}
              className="!text-foreground"
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const Listings = () => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const { rest } = directusStore()

  const { data, isLoading } = useQuery({
    queryKey: ["Fetch Listings", debouncedSearchText],
    queryFn: async () => await rest.request(readItems("listings", {
      search: debouncedSearchText,
      fields: ["*", "user_created.*"]
    })),
    initialData: []
  })

  return (
    <FlatList
      ListHeaderComponent={
        <ListHeaderComponent
          showLoading={isLoading}
          onChangeText={(val) => setSearchText(val)}
          value={searchText}
        />
      }
      ListHeaderComponentStyle={{borderWidth: 0}}
      data={data as ListingDetailed[]}
      renderItem={({ item }) => <ListingCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => <View className="h-4" />}
    />
  );
};

export default function Home() {
  return (
    <View className={cn(Platform.OS === "web" && "mx-auto", "max-w-2xl w-full")}>
      <Listings />
    </View>
  );
}