import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { CardTranslation } from "../../model/CardTranslation"
import { CardTranslationRepository } from "../../repository/CardTranslationRepository"


export const createCardTranslation: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: objects.GraphQLCardTranslation,
  args: {
    translation: { type: objects.GraphQLCardTranslationInput }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const cardTranslation = new CardTranslation(args.translation)
    await dependencies.get(CardTranslationRepository).addCardTranslation(cardTranslation)
    return cardTranslation
  }
})