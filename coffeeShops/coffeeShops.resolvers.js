import client from "../client";

export default {
  CoffeeShop: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),

    catagories: ({ id }) => client.category.findMany({ where: { id } }),
  },
  Category: {
    shops: ({ id }, { page }) => {
      return client.category
        .findUnique({
          where: {
            id,
          },
        })
        .shops({
          take: 5,
          skip: (page - 1) * 5,
        });
    },
    totalShops: ({ id }) =>
      client.coffeeShop.count({
        where: {
          catagories: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
