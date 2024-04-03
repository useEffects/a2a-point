import { useContext } from "react";
import { directusUrl } from "./constants";
import { AuthContext } from "~/context/auth";
import {
  digestStringAsync,
  CryptoDigestAlgorithm,
  CryptoEncoding,
} from 'expo-crypto';
import { Alert, Linking } from "react-native";
import directusStore from "~/store/directus";

export const buildAssetUrl = (id: string) => {
  const { token } = directusStore.getState()
  return `${directusUrl}/assets/${id}?access_token=${token}`;
};

export async function combineUUIDs(
  uuid1: string,
  uuid2: string,
): Promise<string> {
  const combinedUUID = [uuid1, uuid2]
    .map((uuid) => uuid.replace(/-/g, ''))
    .sort()
    .join('');
  const hashedUUID = await digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    combinedUUID,
    { encoding: CryptoEncoding.HEX },
  );
  const combinedUUIDStandard = `${hashedUUID.substring(0, 8)}-${hashedUUID.substring(8, 4)}-${hashedUUID.substring(12, 4)}-${hashedUUID.substring(16, 4)}-${hashedUUID.substring(20, 12)}`;
  // Truncate to 128 bits
  const combinedUUID128Bit = combinedUUIDStandard
    .replace(/-/g, '')
    .slice(0, 32); // Removes hyphens and truncates to 128 bits
  return `${combinedUUID128Bit.slice(0, 8)}-${combinedUUID128Bit.slice(8, 12)}-${combinedUUID128Bit.slice(12, 16)}-${combinedUUID128Bit.slice(16, 20)}-${combinedUUID128Bit.slice(20, 32)}`;
}

export const getDMRoomId = async (
  [userId1, userId2]: [string, string],
  access_token: string,
) => {
  const filters = JSON.stringify({
    _and: [
      {
        isGroup: {
          _eq: false,
        },
      },
      {
        dm_members_uuid_hash: {
          _eq: await combineUUIDs(userId1, userId2),
        },
      },
    ],
  });
  const room = await fetch(`${directusUrl}/items/rooms?filters=${filters}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
  if (!room.data || !room.data.length || !room.data[0].members.length) {
    // const data = await fetch(`${directusUrl}/items/rooms`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    //   body: JSON.stringify({
    //     isGroup: false,
    //   }),
    // }).then((res) => res.json());
    // const roomId = data.data.id;
    // console.log(roomId);
    // const res = await fetch(`${directusUrl}/items/rooms_directus_users`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //   },
    //   body: JSON.stringify(
    //     [userId1, userId2].map((userId) => ({
    //       rooms_id: roomId,
    //       directus_users_id: userId,
    //     })),
    //   ),
    // }).then((res) => res.json());
    // console.log(JSON.stringify(res));
    // return roomId;
    return "";
  } else {
    return room.data[0].id as string;
  }
};

export const openUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    await Linking.openURL(url)
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`)
  }
}