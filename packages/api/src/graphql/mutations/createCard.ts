import * as graphql from "graphql"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { Card } from "../../model/Card"


const CreateCard: GraphqlMutationExport = {
  name: `createCard`,
  mutation: (objects: GraphqlObjects, dependencies: DependencyTree) => ({
    type: objects.GraphQLCard,
    args: {
      card: { type: objects.GraphQLCardInput }, 
    },
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: async (parent: any, args: any) => {
      const card = new Card(args.card)
      await dependencies.get(CardRepository).createCard(card)
      return card
    }
  }),
}


export default CreateCard