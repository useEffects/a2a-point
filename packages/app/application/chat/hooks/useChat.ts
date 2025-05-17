import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import {
  chatFields,
  fetchLimit,
  getChatQueryKeyForRoomId,
  SocketMessageSchema,
} from '../utils';
import { useWS } from './useWS';
import { useAuthFlow } from 'app/application/auth/hooks';
import { createItem, readItems } from '@directus/sdk';
import { Asset, ChatMessage, withId, withUri } from 'app/components/chat-ui';
import { Message, Room } from 'app/lib/types';
import { uploadFileToDirectus } from 'app/lib/file-upload';
import { messagesFolderId } from 'app/lib/constants';
import { useEffect } from 'react';
import { renderCardsQuery2 } from 'app/lib/misc/queries';

export const useChat = (roomId: Room['id']) => {
  const {
    data: { isAuthenticated },
  } = useAuthFlow();
  const queryClient = useQueryClient();
  const { rest } = directusStore();
  const { socket } = useWS();

  const chatQueryData = useInfiniteQuery({
    queryKey: getChatQueryKeyForRoomId(roomId),
    queryFn: async ({ pageParam = 0 }) => {
      const messages = await renderCardsQuery2<
        Omit<ChatMessage<withId>, 'sent'>
      >({
        collection: 'messages',
        fields: chatFields,
        offset: fetchLimit * pageParam,
        filter: {
          room: {
            _eq: roomId,
          },
        },
      });

      return messages.map((m) => ({
        ...m,
        sent: true,
      })) as ChatMessage<withId>[];
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage?.length < fetchLimit) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    initialData: {
      pageParams: [0],
      pages: [],
    },
    enabled: isAuthenticated && Boolean(socket),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const addMessageMutation = useMutation({
    mutationKey: ['CHAT MESSAGE ADD', roomId],
    mutationFn: async (message: ChatMessage<withUri>) => {
      // Optimisitically set the new message
      queryClient.setQueryData(
        getChatQueryKeyForRoomId(roomId),
        (data: InfiniteData<ChatMessage<withId | withUri>>) => {
          return {
            pageParams: data.pageParams.concat([
              Number(data.pageParams[data.pageParams.length - 1]) + 1,
            ]),
            pages: data.pages.concat([newMessage]),
          } as InfiniteData<ChatMessage<withId | withUri>>;
        },
      );

      let assetsIds: { uri: string; id: string }[] = [];
      if (message.assets?.length) {
        assetsIds = await Promise.all(
          message.assets.map(async (asset) => {
            const fileId = await uploadFileToDirectus(asset, messagesFolderId);
            return { id: fileId, uri: asset.uri };
          }),
        );
      }

      const messageToPost: Partial<Message> = {
        assets: assetsIds.map((assetId) => assetId.id),
        content: message.content,
        id: message.id,
        room: roomId,
      };

      await rest.request(createItem('messages', messageToPost));

      const newAssets = message.assets?.map((asset) => ({
        ...asset,
        id: assetsIds.find((assetId) => assetId.uri === asset.uri)?.id,
        uri: undefined,
      })) as Asset<withId>[];

      const newMessage = {
        ...message,
        assets: newAssets,
      } as ChatMessage<withId>;

      return newMessage;
    },
    onSuccess: (successfulMessage: ChatMessage<withId>) => {
      queryClient.setQueryData(
        getChatQueryKeyForRoomId(roomId),
        (data: InfiniteData<ChatMessage<withId | withUri>>) => {
          return {
            ...data,
            pages: data.pages.map((message) =>
              message.id === successfulMessage.id ? successfulMessage : message,
            ),
          } as InfiniteData<ChatMessage<withId | withUri>>;
        },
      );
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    socket.addEventListener('message', (socketMessage) => {
      const data = SocketMessageSchema.parse(socketMessage);
      if (data.type === 'subscription' && data.event === 'create') {
        data.data.forEach((message) => {
          queryClient.setQueryData(
            getChatQueryKeyForRoomId(roomId),
            (data: InfiniteData<ChatMessage<withId | withUri>>) => {
              const lastPageParam = data.pageParams.length - 1;
              return {
                pageParams: data.pageParams.concat([lastPageParam + 1]),
                pages: data.pages.concat([
                  {
                    ...message,
                    sent: true,
                    assets: message.assets.map((asset) => ({
                      id: asset.directus_files_id.id,
                      mimeType: asset.directus_files_id.type,
                      name: asset.directus_files_id.filename_download,
                    })),
                  } satisfies ChatMessage<withId>,
                ]),
              } as InfiniteData<ChatMessage<withId | withUri>>;
            },
          );
        });
      }
    });
  }, [isAuthenticated, socket, queryClient]);

  return { chatQueryData, addMessageMutation };
};
