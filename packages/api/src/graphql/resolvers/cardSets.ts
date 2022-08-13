import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLList } from "graphql"
import { CardSetRepository } from "../../repository/CardSetRepository"

export const cardSets: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLSet),
  resolve: async () => {
    const cards = await dependencies.get(CardSetRepository).getCardSets()
    return cards
  }
})