import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import client from "../../client";
import { protectResolver } from "../users.utils";

const resolverFn = async (
  _,
  {
    username,
    email,
    name,
    location,
    avatarURL,
    githubUsername,
    password: newPassword,
  },
  { loggedInUser }
) => {
  let saveAvatarURL = null;
  if (avatarURL) {
    const { filename, createReadStream } = await avatarURL;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    );
    readStream.pipe(writeStream);
    saveAvatarURL = `http://localhost:4000/static/${newFilename}`;
  }
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      username,
      email,
      name,
      location,
      githubUsername,
      ...(uglyPassword && { password: uglyPassword }),
      ...(saveAvatarURL && { avatarURL: saveAvatarURL }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "could not update profile ",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
  Upload: GraphQLUpload,
};
