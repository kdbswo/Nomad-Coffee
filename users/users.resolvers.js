import client from "../client";

export default {
  User: {
    followers: async ({ id }, { lastId }) => {
      const followers = await client.user.findMany({
        where: {
          following: {
            some: { id },
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      return followers;
    },

    following: ({ id }, { lastId }) => {
      const following = client.user.findMany({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
      return following;
    },

    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: { some: { id } },
        },
      });
      return Boolean(exists);
    },
  },
};
