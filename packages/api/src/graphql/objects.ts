import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import * as constants from "../constants"
import { CardTranslationRepository } from "../repository/CardTranslationRepository"
import { CardSetRepository } from "../repository/CardSetRepository"
import { DependencyTree } from "../util/DependencyTree"

export const getObjects = (dependencies: DependencyTree) => {
  const GraphQLSet = new GraphQLObjectType({
    name: `Set`,
    fields: () => ({
      id: { type: GraphQLString },
      fullName: { type: GraphQLString },
      shortName: { type: GraphQLString },
      releaseDate: { type: GraphQLString },
    })
  })

  const GraphQLSetInput = new GraphQLInputObjectType({
    name: `SetInput`,
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      fullName: { type: GraphQLString },
      shortName: { type: GraphQLString },
      releaseDate: { type: GraphQLString },
    })
  })

  const GraphQLCardTranslation = new GraphQLObjectType({
    name: `CardTranslation`,
    fields: () => ({
      text: { type: GraphQLString },
      flavor: { type: GraphQLString },
      name: { type: new GraphQLNonNull(GraphQLString) },
    })
  })

  const GraphQLCardTranslationInput = new GraphQLInputObjectType({
    name: `CardTranslationInput`,
    fields: () => ({
      cardId: { type: new GraphQLNonNull(GraphQLString) },
      locale: { type: new GraphQLNonNull(GraphQLString) },
      text: { type: GraphQLString },
      flavor: { type: GraphQLString },
      name: { type: new GraphQLNonNull(GraphQLString) },
    })
  })

  const CardTranslationFields: {[key: string]: {type: any}} = {}
  for (const locale of constants.SUPPORTED_LOCALES) {
    CardTranslationFields[locale] = { type: GraphQLCardTranslation }
  }

  const GraphQLCard = new GraphQLObjectType({
    name: `Card`,
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      artist: { type: GraphQLString },
      attack: { type: GraphQLInt },
      collectible: { type: new GraphQLNonNull(GraphQLBoolean) },
      cost: { type: GraphQLInt },
      dbfId: { type: new GraphQLNonNull(GraphQLString) },
      health: { type: GraphQLInt },
      mechanics: { type: GraphQLString },
      rarity: { type: GraphQLString },
      setId: { type: GraphQLString },
      type: { type: GraphQLString },
      tribe: { type: GraphQLString },
      set: {
        type: GraphQLSet,
        async resolve(card) {
          return dependencies.get(CardSetRepository).getCardSet(card.setId)
        }
      },
      strings: {
        type: new GraphQLObjectType({
          name: `CardTranslations`,
          fields: () => CardTranslationFields
        }),
        async resolve(card) {
          const translations = await dependencies.get(CardTranslationRepository).getCardTranslations(card.id)
          const returnedTranslations: {[key: string]: any} = {}

          for (const translation of translations) {
            returnedTranslations[translation.locale] = {
              name: translation.name,
              flavor: translation.flavor,
              text: translation.text,
            }
          }

          return returnedTranslations
        }
      }
    })
  })

  const GraphQLCardInput = new GraphQLInputObjectType({
    name: `CardInput`,
    fields: () => ({
      id: { type: GraphQLString },
      artist: { type: GraphQLString },
      attack: { type: GraphQLInt },
      collectible: { type: GraphQLBoolean },
      cost: { type: GraphQLInt },
      dbfId: { type: GraphQLInt },
      durability: { type: GraphQLInt },
      flavor: { type: GraphQLString },
      health: { type: GraphQLInt },
      mechanics: { type: GraphQLString },
      name: { type: GraphQLString },
      rarity: { type: GraphQLString },
      setId: { type: GraphQLString },
      text: { type: GraphQLString },
      type: { type: GraphQLString },
      tribe: { type: GraphQLString },
    })
  })

  return {
    GraphQLSet,
    GraphQLSetInput,
    GraphQLCard,
    GraphQLCardInput,
    GraphQLCardTranslation,
    GraphQLCardTranslationInput,
  }
}

