import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { CardTranslation } from "../../model/CardTranslation"
import { CardTranslationRepository } from "../../repository/CardTranslationRepository"
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"


export const createCardTranslations: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLObjectType({
    name: `CreateCardTranslationBulkResults`,
    fields: () => ({
      translations: { type: objects.GraphQLCardTranslation },
      errors: { type: GraphQLList(GraphQLString) },
    })
  }),
  args: {
    translations: { type: GraphQLList(objects.GraphQLCardTranslationInput) }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const translations = []
    const errors = []

    for (const t of args.translations) {
      const cardTranslation = new CardTranslation(t)
      try {
        await dependencies.get(CardTranslationRepository).addCardTranslation(cardTranslation)
        translations.push(cardTranslation)
      } catch (e) {
        errors.push(e)
      }
    }

    return {translations, errors}
  }
})