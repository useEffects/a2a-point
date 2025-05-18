import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from 'app/context/router';
import { FC, useEffect } from 'react';

export const useHeader = (header: FC<{}>) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const parent = navigation?.getParent();

    if (isFocused) {
      parent?.setOptions({ header });
    }
  }, [navigation, isFocused]);
};
