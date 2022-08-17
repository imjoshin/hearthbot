import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { CardSet } from "../../model/CardSet"
import { CardSetRepository } from "../../repository/CardSetRepository"
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"


export const cardSets: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  permissions: {canWrite: true},
  type: new GraphQLObjectType({
    name: `CardSetBulkResults`,
    fields: () => ({
      success: { type: GraphQLInt },
      errors: { type: GraphQLList(GraphQLString) },
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
      const set = new CardSet(s)
      try {
        await dependencies.get(CardSetRepository).upsertCardSet(set)
        sets.push(set)
      } catch (e) {
        errors.push(e)
      }
    }

    return {success: sets.length, errors}
  }
})