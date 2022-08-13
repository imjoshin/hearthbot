import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLBoolean, GraphQLList } from "graphql"
import { CardSetRepository } from "../../repository/CardSetRepository"

export const cardSets: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLSet),
  args: {
    released: { type: GraphQLBoolean }, 
    hasScrapeUrl: { type: GraphQLBoolean },
  },
  resolve: async (_, args) => {
    const filter = {
      released: args.released,
      hasScrapeUrl: args.hasScrapeUrl,
    }
    const cards = await dependencies.get(CardSetRepository).getCardSets(filter)
    return cards
  }
})