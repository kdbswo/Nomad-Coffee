import { gql } from "apollo-server-express";

export default gql`
  type ToggleFollowResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    toggleFollow(username: String!): ToggleFollowResult!
  }
`;
