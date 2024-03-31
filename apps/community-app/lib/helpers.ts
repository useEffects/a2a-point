import { useContext } from "react";
import { directusUrl } from "./constants";
import { AuthContext } from "~/context/auth";

export const buildAssetUrl = (id: string, access_token: string) => {
  return `${directusUrl}/assets/${id}?access_token=${access_token}`;
};

export const getDMRoomId = async (
  [userId1, userId2]: [string, string],
  access_token: string,
) => {
  const room = await fetch(
    `${directusUrl}/items/rooms?[members][_contains]=${userId1}&[members][_contains]=${userId2}&[isGroup][_eq]=false`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  ).then((res) => res.json());
  if (!room.data || !room.data.length || !room.data[0].members.length) {
    const data = await fetch(`${directusUrl}/items/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        isGroup: false,
      }),
    }).then((res) => res.json());
    const roomId = data.data.id;
    console.log(roomId);
    const res = await fetch(`${directusUrl}/items/rooms_directus_users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(
        [userId1, userId2].map((userId) => ({
          rooms_id: roomId,
          directus_users_id: userId,
        })),
      ),
    }).then((res) => res.json());
    console.log(JSON.stringify(res));
    return roomId;
  } else {
    return room.data[0].id as string;
  }
};
