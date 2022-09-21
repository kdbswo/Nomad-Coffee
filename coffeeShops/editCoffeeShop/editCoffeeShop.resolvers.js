import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processCategories } from "../coffeeShops.utils";

export default {
  Mutation: {
    editCoffeeShop: protectResolver(
      async (
        _,
        { id, name, catagories, latitude, longitude },
        { loggedInUser }
      ) => {
        const oldCoffeeShop = await client.coffeeShop.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            catagories: {
              select: {
                name: true,
              },
            },
          },
        });
        if (!oldCoffeeShop) {
          return {
            ok: false,
            error: "coffeeshop not found",
          };
        }
        await client.coffeeShop.update({
          where: {
            id,
          },
          data: {
            name,
            latitude,
            longitude,
            catagories: {
              disconnect: oldCoffeeShop.catagories,
              connectOrCreate: processCategories(catagories),
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
