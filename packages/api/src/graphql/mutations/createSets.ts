import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Set } from "../../model/Set"
import { SetRepository } from "../../repository/SetRepository"
import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql"


export const createSets: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLObjectType({
    name: `CreateSetBulkResults`,
    fields: () => ({
      success: { type: GraphQLInt },
    })
  }),
  args: {
    sets: { type: GraphQLList(objects.GraphQLSetInput) }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const sets = []

    // TODO error handle
    const errors = []

    for (const s of args.sets) {
      const set = new Set(s)
      try {
        await dependencies.get(SetRepository).createSet(set)
        sets.push(set)
      } catch (e) {
        errors.push(e)
      }
    }

    return {success: sets.length}
  }
})