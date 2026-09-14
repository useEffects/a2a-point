import { AsyncImage } from 'app/components/async-image';
import { Button } from 'app/components/ui/button';
import { buildAssetUrl } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { View } from 'react-native';
import { Edit, Redo2 } from 'app/components/icons';
import { useColorScheme } from 'app/hooks/color-scheme';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { Asset, withUri } from 'app/components/chat-ui';

export const ProfilePic = () => {
  const { colors } = useColorScheme();
  const { user } = userStore();
  const [selectedImage, setSelectedImage] = useState<Asset<withUri> | null>(
    null,
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]!;
      setSelectedImage({
        mimeType: asset.mimeType ?? '',
        name: asset.fileName ?? '',
        uri: asset.uri,
      });
    }
  };

  const Icon = useMemo(() => (selectedImage ? Redo2 : Edit), [selectedImage]);

  return (
    <View className="relative">
      <AsyncImage
        source={{ uri: selectedImage?.uri || buildAssetUrl(user.avatar) }}
        className="w-32 h-32 rounded-full border-primary border border-solid border-border shadow-xl shadow"
      />
      <Button
        variant={'base'}
        className="bg-background rounded-full !w-8 !h-8 !px-0 !py-0 absolute top-auto bottom-0 left-auto right-0"
        onPress={pickImage}
      >
        <Icon color={colors.info} size={14} />
      </Button>
    </View>
  );
};
