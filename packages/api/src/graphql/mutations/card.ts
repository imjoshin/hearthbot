import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Card } from "../../model/Card"


export const card: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: objects.GraphQLCard,
  args: {
    card: { type: objects.GraphQLCardInput }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const card = new Card(args.card)
    await dependencies.get(CardRepository).upsertCard(card)
    return card
  }
})