import { gql } from "apollo-server-express";

export default gql`
  type CreateCoffeeShop {
    ok: Boolean!
    error: String
  }
  type Mutation {
    createCoffeeShop(
      name: String!
      latitude: String
      longitude: String
      catagories: String
      photos: Upload
    ): CreateCoffeeShop!
  }
  scalar Upload
`;
