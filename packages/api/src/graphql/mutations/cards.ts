import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Card } from "../../model/Card"

const Cards: GraphqlMutationExport = {
  name: `createCard`,
  mutation: (objects: GraphqlObjects, dependencies: DependencyTree) => ({
    type: objects.GraphQLCard,
    args: {
      id: { type: graphql.GraphQLString },
      artist: { type: graphql.GraphQLString },
      attack: { type: graphql.GraphQLInt },
      collectible: { type: graphql.GraphQLBoolean },
      cost: { type: graphql.GraphQLInt },
      dbfId: { type: graphql.GraphQLString },
      flavor: { type: graphql.GraphQLString },
      health: { type: graphql.GraphQLInt },
      name: { type: graphql.GraphQLString },
      rarity: { type: graphql.GraphQLString },
      setId: { type: graphql.GraphQLString },
      text: { type: graphql.GraphQLString },
      type: { type: graphql.GraphQLString },
      tribes: { type: graphql.GraphQLString },
    },
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: async (parent: any, args: any) => {
      const card = new Card(args)
      await dependencies.get(CardRepository).createCard(card)
      return card
    }
  }),
}


export default Cards