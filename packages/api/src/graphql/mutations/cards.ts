import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"

const Cards: GraphqlMutationExport = {
  name: `addCards`,
  mutation: (objects: GraphqlObjects, dependencies: DependencyTree) => ({
    type: objects.GraphQLCard,
    args: {
      id: { type: graphql.GraphQLString }
    },
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: async (parent: any, args: any) => {
      console.log({parent, args})
      // const cards = await dependencies.get(CardRepository).getCards()
      return { name: `test` }
    }
  }),
}


export default Cards