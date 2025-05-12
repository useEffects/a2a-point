import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { chatFields, getChatQueryKeyForRoomId } from '../utils';
import { useWS } from './useWS';
import { useAuthFlow } from 'app/application/auth/hooks';
import { createItem, readItems } from '@directus/sdk';
import { Asset, ChatMessage, withId, withUri } from 'app/components/chat-ui';
import { Message } from 'app/lib/types';
import { uploadFileToDirectus } from 'app/lib/file-upload';
import { messagesFolderId } from 'app/lib/constants';
import { useEffect } from 'react';

export const useChat = (roomId: string) => {
  const {
    data: { isAuthenticated },
  } = useAuthFlow();
  const queryClient = useQueryClient();
  const { rest } = directusStore();
  const { socket } = useWS();

  const chatQueryData = useInfiniteQuery({
    queryKey: getChatQueryKeyForRoomId(roomId).concat(['']),
    queryFn: async ({ pageParam = 0 }) => {
      const messages = await rest.request(
        readItems('messages', {
          fields: chatFields,
          offset: fetchLimit * pageParam,
          filter: {
            room: {
              _eq: roomId,
            },
          },
        }),
      );

      return {
        items: messages as ChatMessage<withId>[],
        page: Number(pageParam),
      };
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < fetchLimit) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    initialData: {
      pageParams: [0],
      pages: [
        {
          items: [],
          page: 0,
        },
      ],
    },
    enabled: isAuthenticated && Boolean(socket),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const addMessageMutation = useMutation({
    mutationKey: ['CHAT MESSAGE ADD', roomId],
    mutationFn: async (message: ChatMessage<withUri>) => {
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

  const addMessageMutationOptimistic = useMutation({
    mutationKey: ['CHAT MESSAGE ADD OPTIMISTIC', roomId],
    mutationFn: async (newMessage: ChatMessage<withUri>) => {
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
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    socket.onmessage();
  }, [isAuthenticated, socket]);

  return { chatQueryData, addMessageMutation, addMessageMutationOptimistic };
};

const fetchLimit = 30;
