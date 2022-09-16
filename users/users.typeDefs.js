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
  }
  type CreateAccountResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    createAccount(
      username: String!
      email: String!
      name: String
      location: String
      githubUsername: String
      password: String!
    ): CreateAccountResult!
  }
  type Query {
    seeProfile(username: String!): User
  }
`;
