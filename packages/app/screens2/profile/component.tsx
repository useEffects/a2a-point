import { ProfileTemplate } from 'app/components2/templates/profile/component';
import { useColorScheme } from 'app/hooks/color-scheme';
import { View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { ProfileScreenProps } from './types';
import {
  ProfileDetails,
  profileDetailsHeight,
} from 'app/components2/organisms/profile/profile-details';
import { ScrollViewDefaultProps } from 'app/components/utils/virtual-lists';

export const ProfileScreen = (props: ProfileScreenProps) => {
  const { colors } = useColorScheme();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => (scrollY.value = event.contentOffset.y),
  });

  const hideOnScrollStyle = useProfileScreenAnimatedStyle(scrollY);
  return (
    <View className="flex-1">
      <Animated.ScrollView
        style={{ backgroundColor: colors.accent }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        {...ScrollViewDefaultProps}
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
  const SPEED_MULTIPLIER = 0.5;
  const INPUT_RANGE_MAX = 25;
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
