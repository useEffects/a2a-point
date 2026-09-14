import { useAuthFlow } from 'app/application/auth/hooks';
import { logout } from 'app/application/auth/logout';
import { Button } from 'app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'app/components/ui/dropdown-menu';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { useColorScheme } from 'app/hooks/color-scheme';
import { keycloakStore } from 'app/store/keycloak';
import { Bell, EllipsisVertical, LogOut, UserCog2 } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, View } from 'react-native';

export const ProfileHeaderDropdown = () => {
  const router = useRouter();

  const [_, setOpen] = useState(false);

  const { colors } = useColorScheme();
  const {
    data: { isAuthenticated },
  } = useAuthFlow();

  return isAuthenticated ? (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <EllipsisVertical
            size={24}
            color={colors.foreground}
            className="text-foreground"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={Platform.OS !== 'web' ? -40 : undefined}>
        <DropdownMenuItem
          onPress={() => {
            setOpen(false);
            logout();
            router.push('/');
          }}
        >
          <View className="flex-row items-center gap-2">
            <LogOut
              color={colors['popover-foreground']}
              size={18}
              className="text-popover-foreground"
            />
            <Text>Logout</Text>
          </View>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            setOpen(false);
            router.push('/agents/me/notifications');
          }}
        >
          <View className="flex-row items-center gap-2">
            <Bell
              size={18}
              color={colors['popover-foreground']}
              className="text-popover-foreground"
            />
            <Text>Notifications</Text>
          </View>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            setOpen(false);
            router.push('/account-console');
          }}
        >
          <View className="flex-row items-center gap-2">
            <UserCog2
              color={colors['popover-foreground']}
              size={18}
              className="text-popover-foreground"
            />
            <Text>Account console</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <></>
  );
};
