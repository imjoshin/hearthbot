import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Set } from "../../model/Set"
import { SetRepository } from "../../repository/SetRepository"

export const createSet: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: objects.GraphQLSet,
  args: {
    set: { type: objects.GraphQLSetInput }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const set = new Set(args.set)
    await dependencies.get(SetRepository).createSet(set)
    return set
  }
})