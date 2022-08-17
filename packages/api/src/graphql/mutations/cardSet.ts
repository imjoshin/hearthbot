import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { CardSet } from "../../model/CardSet"
import { CardSetRepository } from "../../repository/CardSetRepository"

export const cardSet: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  permissions: {canWrite: true},
  type: objects.GraphQLSet,
  args: {
    set: { type: objects.GraphQLSetInput }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const set = new CardSet(args.set)
    await dependencies.get(CardSetRepository).upsertCardSet(set)
    return set
  }
})