import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLList, GraphQLString } from "graphql"

export const cards: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLCard),
  args: {
    name: { type: GraphQLString }, 
    locale: { type: GraphQLString }, 
  },
  resolve: async (parent, args, context, resolveInfo) => {
  // resolve: async () => {
    const filter = {
      name: args.name,
      locale: args.locale,
    }
    const cards = await dependencies.get(CardRepository).getCards(filter)
    return cards
  }
})