import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { CardTranslation } from "../../model/CardTranslation"
import { CardTranslationRepository } from "../../repository/CardTranslationRepository"
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"


export const cardTranslations: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLObjectType({
    name: `CardTranslationBulkResults`,
    fields: () => ({
      success: { type: GraphQLInt },
      errors: { type: GraphQLList(GraphQLString) },
    })
  }),
  args: {
    translations: { type: GraphQLList(objects.GraphQLCardTranslationInput) }, 
  },
  // resolve: (parent, args, context, resolveInfo) => {
  resolve: async (parent: any, args: any) => {
    const translations = []

    // TODO error handle
    const errors = []

    for (const t of args.translations) {
      const cardTranslation = new CardTranslation(t)
      try {
        await dependencies.get(CardTranslationRepository).upsertCardTranslation(cardTranslation)
        translations.push(cardTranslation)
      } catch (e) {
        errors.push(e)
      }
    }

    return {success: translations.length, errors}
  }
})