import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql"

export const cards: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLCard),
  args: {
    name: { type: GraphQLString }, 
    locale: { type: GraphQLString }, 
    collectible: { type: GraphQLBoolean }, 
    cost: { type: objects.GraphQLRangeInput }, 
    dbfIds: { type: GraphQLList(GraphQLInt) }, 
  },
  resolve: async (_, args) => {
    const filter = {
      name: args.name,
      locale: args.locale,
      collectible: args.collectible,
      cost: args.cost,
      dbfIds: args.dbfIds,
    }
    const cards = await dependencies.get(CardRepository).getCards(filter)
    return cards
  }
})