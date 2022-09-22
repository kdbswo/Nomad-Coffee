import { createWriteStream } from "fs";
import client from "../../client";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import { protectResolver } from "../../users/users.utils";
import { processCategories } from "../coffeeShops.utils";

export default {
  Mutation: {
    createCoffeeShop: protectResolver(
      async (
        _,
        { name, latitude, longitude, catagories, photos },
        { loggedInUser }
      ) => {
        try {
          let catagoriesObj = [];
          let savePhotos = null;
          const exist = await client.coffeeShop.findUnique({
            where: { name },
            select: { name: true },
          });
          if (exist) {
            return {
              ok: false,
              error: "name is already exist",
            };
          }
          if (catagories) {
            catagoriesObj = processCategories(catagories);
          }
          if (photos) {
            const { filename, createReadStream } = await photos;
            const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
            const readStream = createReadStream();
            const writeStream = createWriteStream(
              process.cwd() + "/uploads/photos/" + newFilename
            );
            readStream.pipe(writeStream);
            savePhotos = `http://localhost:4000/static/${newFilename}`;
          }
          const create = await client.coffeeShop.create({
            data: {
              name,
              latitude,
              longitude,
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              ...(catagoriesObj.length > 0 && {
                catagories: {
                  connectOrCreate: catagoriesObj,
                },
              }),
              ...(savePhotos && {
                photos: {
                  create: { url: savePhotos },
                },
              }),
            },
          });
          if (create.id) {
            return {
              ok: true,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: `$error`,
          };
        }
      }
    ),
  },
  Upload: GraphQLUpload,
};
