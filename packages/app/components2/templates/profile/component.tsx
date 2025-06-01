import { View } from 'react-native';
import { ProfileTemplateProps } from './types';
import { Text } from 'app/components/ui/text';
import { ProfileHeaderDetails } from 'app/components2/organisms/profile/header/profile-header-details';

export const ProfileTemplate = ({
  user,
  company,
  document,
}: ProfileTemplateProps) => {
  return (
    <View>
      <ProfileHeaderDetails user={user} />
      <View className="bg-background min-h-[1000] rounded-tr-3xl rounded-tl-3xl p-4">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam optio
          sint eos, sunt distinctio eligendi id perferendis tenetur eaque minus
          vitae cupiditate maiores fugit alias temporibus est quisquam. Soluta
          blanditiis quos sit veniam qui delectus temporibus molestias mollitia
          inventore voluptas, laboriosam libero minus. Tenetur, labore modi?
          Tempora officia obcaecati dicta dolore cumque rem quaerat quia culpa.
          Veritatis, quas ex! Excepturi nulla nobis corrupti tempore unde illo
          natus aspernatur, quia obcaecati iure distinctio, veniam itaque
          sapiente eaque saepe quod? Vero perspiciatis autem, explicabo
          architecto nostrum fuga ullam cupiditate doloribus saepe obcaecati
          recusandae similique sunt voluptate soluta, quidem, laudantium totam?
          Architecto, tempora?
        </Text>
      </View>
    </View>
  );
};
