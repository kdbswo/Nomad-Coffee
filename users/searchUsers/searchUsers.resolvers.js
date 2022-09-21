import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword, page }) => {
      const searchedUsers = await client.user.findMany({
        where: {
          username: {
            mode: "insensitive",
            startsWith: keyword.toLowerCase(),
          },
        },
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalSearch = await client.user.count({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      });
      return {
        searchedUsers,
        totalSearchPages: Math.ceil(totalSearch / 5),
      };
    },
  },
};
