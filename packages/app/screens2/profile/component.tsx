import { ProfileTemplate } from 'app/components2/templates/profile/component';
import { useColorScheme } from 'app/hooks/color-scheme';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { ProfileScreenProps } from './types';
import {
  ProfileDetails,
  profileDetailsHeight,
} from 'app/components2/templates/profile/profile-details';
import { ScrollViewDefaultProps } from 'app/components/utils/virtual-lists';
import { useState } from 'react';
import { Separator } from 'app/components/ui/separator';
import { Portal } from 'app/components/primitives/portal';
import { profileScreenHeaderPortalName } from 'app/components2/templates/profile/header';

export const ProfileScreen = (props: ProfileScreenProps) => {
  const { colors } = useColorScheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => (scrollY.value = event.contentOffset.y),
  });
  useDerivedValue(() => {
    const collapsed = scrollY.value * SPEED_MULTIPLIER >= INPUT_RANGE_MAX;
    runOnJS(setIsCollapsed)(collapsed);
  }, [scrollY]);

  const hideOnScrollStyle = useProfileScreenAnimatedStyle(scrollY);
  return (
    <View className="flex-1">
      <Portal hostName={profileScreenHeaderPortalName} name="slot-1">
        {isCollapsed ? <Separator /> : <></>}
      </Portal>
      <Animated.ScrollView
        {...ScrollViewDefaultProps}
        style={{ backgroundColor: colors.accent }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        nestedScrollEnabled
      >
        <Animated.View style={[hideOnScrollStyle, { overflow: 'hidden' }]}>
          <ProfileDetails user={props.user} />
        </Animated.View>
        <ProfileTemplate {...props} />
      </Animated.ScrollView>
    </View>
  );
};

const useProfileScreenAnimatedStyle = (scrollY: SharedValue<number>) => {
  return useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value * SPEED_MULTIPLIER,
        [0, INPUT_RANGE_MAX],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value * SPEED_MULTIPLIER,
            [0, INPUT_RANGE_MAX],
            [0, -20],
            Extrapolation.CLAMP,
          ),
        },
      ],
      height: interpolate(
        scrollY.value * SPEED_MULTIPLIER,
        [0, INPUT_RANGE_MAX],
        [profileDetailsHeight, 0],
        Extrapolation.CLAMP,
      ),
    };
  });
};

const SPEED_MULTIPLIER = 0.25;
const INPUT_RANGE_MAX = 100;
