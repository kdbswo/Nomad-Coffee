import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, location, githubUsername, password }
    ) => {
      try {
        const exsitingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (exsitingUser) {
          throw new Error("This username or email is already taken.");
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            username,
            email,
            name,
            location,
            githubUsername,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          error: "Cant create account",
        };
      }
    },
  },
};
