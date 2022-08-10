import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Card } from "../../model/Card"


export const createCards: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new graphql.GraphQLObjectType({
    name: `CreateCardBulkResults`,
    fields: () => ({
      cards: { type: objects.GraphQLCard },
      errors: { type: graphql.GraphQLList(graphql.GraphQLString) },
    })
  }),
  args: {
    cards: { type: graphql.GraphQLList(objects.GraphQLCardInput) }, 
  },
  resolve: async (parent: any, args: any) => {
    const cards = []
    const errors = []

    for (const c of args.cards) {
      const card = new Card(c)
      try {
        await dependencies.get(CardRepository).createCard(card)
        cards.push(card)
      } catch (e) {
        errors.push(e)
      }
    }

    return {cards, errors}
  }
})