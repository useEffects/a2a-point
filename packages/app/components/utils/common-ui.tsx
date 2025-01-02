import { ArrowUpRight, Plus } from 'app/components/icons';
import { useRouter } from 'app/hooks/router';
import { cn } from 'app/lib/utils';
import { ComponentType, ReactNode, useState } from 'react';
import { Platform, View } from 'react-native';
import { Button, ButtonProps } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Text } from '../ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';

export const ViewAllButton = ({
  button,
  horizontal,
}: {
  button: ComponentType<ButtonProps>;
  horizontal: boolean;
}) => {
  const Component = button;
  return (
    <Component
      variant={'ghost'}
      size={'none'}
      className={cn('h-28 w-28 flex-col gap-1', horizontal ? 'mx-4' : 'my-4')}
    >
      <Text className="text-subtext">View all</Text>
      <ArrowUpRight className="text-info" />
    </Component>
  );
};

export const GoToPostButtonUi = () => {
  const [key, setKey] = useState('Buy');
  const [open, setOpen] = useState(false);
  const { colors } = useColorScheme();
  const router = useRouter();

  const ButtonComponent =
    Platform.OS !== 'web'
      ? ({ children }: { children: ReactNode }) => (
          <Button
            className="rounded-full"
            size={'icon'}
            onPress={() => setOpen((p) => !p)}
            children={children}
          />
        )
      : ({ children }: { children: ReactNode }) => (
          <View
            className="rounded-full bg-primary flex justify-center items-center w-10 h-10"
            children={children}
          />
        );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={Platform.OS === 'web' ? undefined : true}>
        <ButtonComponent>
          <Plus
            size={24}
            color={colors['primary-foreground']}
            className="text-primary-foreground"
          />
        </ButtonComponent>
      </DialogTrigger>
      <DialogContent className="w-[350px] rounded">
        <DialogHeader>
          <DialogTitle>Post a new lead</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Share a property lead with agents. Ensure information is accurate and
          complete.
        </DialogDescription>
        <View className="flex-row w-full gap-4 flex-wrap justify-start">
          {['Buy', 'Sale', 'Give on rent', 'Take on rent'].map((item, i) => (
            <Button
              className="self-start"
              size={'sm'}
              key={i}
              variant={item === key ? 'secondary' : 'outline'}
              onPress={() => setKey(item)}
            >
              <Text>{item}</Text>
            </Button>
          ))}
        </View>
        <Separator />
        <DialogFooter>
          <Button
            onPress={() => {
              setOpen(false);
              router.push(`/listings/post/?deal_type=${key.toLowerCase()}`);
            }}
            className="self-start ml-auto mr-0"
            size={'sm'}
            variant={'default'}
          >
            <Text>Proceed</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
