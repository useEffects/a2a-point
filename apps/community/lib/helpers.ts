import { directusUrl } from "./constants";
import { Alert, Linking } from "react-native";
import directusStore from "~/store/directus";

export const buildAssetUrl = (id: string | null) => {
  if (null) {
    return "https://dev.a2apoint.com"
  }
  const { token } = directusStore.getState()
  return `${directusUrl}/assets/${id}?access_token=${token}`;
};

export const openUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url)
  if (supported) {
    await Linking.openURL(url)
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`)
  }
}