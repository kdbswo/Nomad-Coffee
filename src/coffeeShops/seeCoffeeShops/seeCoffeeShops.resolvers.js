import client from "../../client";

export default {
  Query: {
    seeCoffeeShops: (_, { lastId }) =>
      client.coffeeShop.findMany({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};
