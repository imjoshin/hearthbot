import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../dependencies"

const Cards: GraphqlResolverExport = {
  name: `cards`,
  resolver: (objects: GraphqlObjects, dependencies: DependencyTree) => ({
    type: new graphql.GraphQLList(objects.GraphQLCard),
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: async () => {
      const cards = await dependencies.get(CardRepository).getCards()
      return cards
    }
  }),
}


export default Cards