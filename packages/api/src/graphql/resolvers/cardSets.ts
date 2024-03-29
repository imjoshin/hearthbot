import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLBoolean, GraphQLList } from "graphql"
import { CardSetRepository } from "../../repository/CardSetRepository"

export const cardSets: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  permissions: {canRead: true},
  type: new GraphQLList(objects.GraphQLSet),
  args: {
    released: { type: GraphQLBoolean }, 
    hasScrapeUrl: { type: GraphQLBoolean },
    prerelease: { type: GraphQLBoolean },
  },
  resolve: async (_, args) => {
    const filter = {
      released: args.released,
      hasScrapeUrl: args.hasScrapeUrl,
      prerelease: args.prerelease,
    }
    const cards = await dependencies.get(CardSetRepository).getCardSets(filter)
    return cards
  }
})