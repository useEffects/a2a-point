import BottomSheet from 'app/components/bottomsheet';
import { Button } from 'app/components/ui/button';
import { ListingsFilterTemplate } from 'app/components2/templates/listings/filters';
import { useColorScheme } from 'app/hooks/color-scheme';
import { ListFilter } from 'lucide-react-native';
import { useState } from 'react';

export const ListingsFilterButton = () => {
  const { colors } = useColorScheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={'ghost'} size={'icon'} onPress={() => setOpen(true)}>
        <ListFilter
          color={open ? colors.foreground : colors.subtext}
          size={18}
        />
      </Button>
      <BottomSheet
        open={open}
        setOpen={setOpen}
        onBackdropPress={() => setOpen(false)}
      >
        <ListingsFilterTemplate onClose={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
};
