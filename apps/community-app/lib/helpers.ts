import { useContext } from "react";
import { directusUrl } from "./constants";
import {
  digestStringAsync,
  CryptoDigestAlgorithm,
  CryptoEncoding,
} from 'expo-crypto';
import { Alert, Linking } from "react-native";
import directusStore from "~/store/directus";

export const buildAssetUrl = (id: string | null) => {
  if (null) {
    return "https://dev.a2apoint.com"
  }
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

export const openUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    await Linking.openURL(url)
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`)
  }
}