import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"

export const cards: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new graphql.GraphQLList(objects.GraphQLCard),
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async () => {
    const cards = await dependencies.get(CardRepository).getCards()
    return cards
  }
})