import { Image, StyleSheet, Platform, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
     <Text className='text-primary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium maxime minus totam similique fugit, officiis eaque? Temporibus veritatis nesciunt quos ea? Explicabo, illum accusamus, omnis non molestiae illo voluptates deleniti nisi voluptatum fugiat minima laudantium quia dolorem nam inventore. Fugiat nostrum dicta ipsa animi minima. Iure, tenetur quibusdam voluptatem ullam tempora in voluptatum ea autem saepe quidem enim dolorum delectus laudantium numquam expedita commodi mollitia eligendi perferendis repudiandae, quis non nisi vitae. Deserunt commodi quisquam totam repudiandae placeat dolorem, libero quidem voluptatibus in tempora quam numquam dolor eius id est alias doloremque dicta quas. Autem voluptatem est ullam adipisci! Eum!</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
