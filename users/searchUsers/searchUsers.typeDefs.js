import { gql } from "apollo-server-express";

export default gql`
  type SearchUsersResult {
    searchedUsers: [User]
    totalSearchPages: Int!
  }
  type Query {
    searchUsers(keyword: String!, page: Int!): SearchUsersResult!
  }
`;
