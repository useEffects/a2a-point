import { BottomSheetProps, BottomSheet as RNEBottomSheet } from '@rneui/themed';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Separator } from '../ui/separator';
import { Dimensions, Platform } from 'react-native';
import { merge } from 'lodash';

export default function BottomSheet(props: {
  open: boolean;
  setOpen: (newState: boolean) => void;
  onBackdropPress: () => void;
  children: ReactNode;
  bottomSheetProps?: BottomSheetProps;
}) {
  return (
    <RNEBottomSheet
      {...merge(
        {
          isVisible: props.open,
          onBackdropPress: props.onBackdropPress,
          backdropStyle: { backgroundColor: 'transparent' },
          containerStyle: {
            backgroundColor: 'transparent',
          },
          scrollViewProps: {
            bounces: false,
            overScrollMode: 'never',
            bouncesZoom: false,
            alwaysBounceHorizontal: false,
            alwaysBounceVertical: false,
            showsVerticalScrollIndicator: Platform.OS === 'web',
            showsHorizontalScrollIndicator: Platform.OS === 'web',
          },
        },
        props.bottomSheetProps ?? {},
      )}
    >
      <Separator />
      {props.children}
    </RNEBottomSheet>
  );
}
