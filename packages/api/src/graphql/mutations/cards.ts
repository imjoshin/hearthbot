import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Card } from "../../model/Card"
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"


export const cards: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLObjectType({
    name: `CardBulkResults`,
    fields: () => ({
      success: { type: GraphQLInt },
      errors: { type: GraphQLList(GraphQLString) },
    })
  }),
  args: {
    cards: { type: GraphQLList(objects.GraphQLCardInput) }, 
  },
  resolve: async (parent: any, args: any) => {
    const cards = []

    // TODO error handle
    const errors = []

    for (const c of args.cards) {
      const card = new Card(c)
      try {
        await dependencies.get(CardRepository).upsertCard(card)
        cards.push(card)
      } catch (e) {
        errors.push(e)
      }
    }

    return {success: cards.length, errors}
  }
})