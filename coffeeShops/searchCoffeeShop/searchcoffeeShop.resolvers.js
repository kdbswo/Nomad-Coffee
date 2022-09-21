import client from "../../client";

export default {
  Query: {
    searchCoffeeShop: (_, { keyword }) =>
      client.coffeeShop.findMany({
        where: {
          name: {
            startsWith: keyword,
          },
        },
      }),
  },
};
