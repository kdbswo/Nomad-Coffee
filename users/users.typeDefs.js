import { gql } from "apollo-server";

export default gql`
  type User {
    id: String!
    username: String!
    email: String!
    name: String
    location: String
    avatarURL: String
    githubUsername: String
    createAt: String!
    updateAt: String!
    following(lastId: Int): [User]
    followers(lastId: Int): [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
  }
`;
