import client from "../../client";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    toggleFollow: protectResolver(async (_, { username }, { loggedInUser }) => {
      const exist = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!exist) {
        return {
          ok: false,
          error: "found not user",
        };
      }
      const currentFollowing = await client.user.findFirst({
        where: {
          id: loggedInUser.id,
          following: {
            some: { username },
          },
        },
        select: { id: true },
      });
      if (!currentFollowing) {
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              connect: {
                username,
              },
            },
          },
        });
      } else {
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              disconnect: {
                username,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};
