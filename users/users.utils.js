import jwt from "jsonwebtoken";
import client from "../client";
/**로그인된 유저 */
export const getUsers = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
/**로그인 확인 */
export const protectResolver = (ourResolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "Please log in to perform this action",
    };
  }
  return ourResolver(root, args, context, info);
};
