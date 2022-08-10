import * as constants from "../constants"
import * as graphql from "graphql"
import { CardTranslationRepository } from "../repository/CardTranslationRepository"
import { SetRepository } from "../repository/SetRepository"
import { DependencyTree } from "../util/DependencyTree"

export const getObjects = (dependencies: DependencyTree) => {
  const GraphQLSet = new graphql.GraphQLObjectType({
    name: `Set`,
    fields: () => ({
      id: { type: graphql.GraphQLString },
      fullName: { type: graphql.GraphQLString },
      shortName: { type: graphql.GraphQLString },
      releaseDate: { type: graphql.GraphQLString },
    })
  })

  const GraphQLCardTranslation = new graphql.GraphQLObjectType({
    name: `CardTranslation`,
    fields: () => ({
      text: { type: graphql.GraphQLString },
      flavor: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
    })
  })

  const GraphQLCardTranslationInput = new graphql.GraphQLInputObjectType({
    name: `CardTranslationInput`,
    fields: () => ({
      cardId: { type: graphql.GraphQLString },
      locale: { type: graphql.GraphQLString },
      text: { type: graphql.GraphQLString },
      flavor: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
    })
  })

  const CardTranslationFields: {[key: string]: {type: any}} = {}
  for (const locale of constants.SUPPORTED_LOCALES) {
    CardTranslationFields[locale] = { type: GraphQLCardTranslation }
  }

  const GraphQLCard = new graphql.GraphQLObjectType({
    name: `Card`,
    fields: () => ({
      id: { type: graphql.GraphQLString },
      artist: { type: graphql.GraphQLString },
      attack: { type: graphql.GraphQLInt },
      collectible: { type: graphql.GraphQLBoolean },
      cost: { type: graphql.GraphQLInt },
      dbfId: { type: graphql.GraphQLInt },
      health: { type: graphql.GraphQLInt },
      mechanics: { type: graphql.GraphQLString },
      rarity: { type: graphql.GraphQLString },
      setId: { type: graphql.GraphQLString },
      type: { type: graphql.GraphQLString },
      tribe: { type: graphql.GraphQLString },
      set: {
        type: GraphQLSet,
        async resolve(card) {
          return dependencies.get(SetRepository).getSet(card.setId)
        }
      },
      strings: {
        type: new graphql.GraphQLObjectType({
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

  const GraphQLCardInput = new graphql.GraphQLInputObjectType({
    name: `CardInput`,
    fields: () => ({
      id: { type: graphql.GraphQLString },
      artist: { type: graphql.GraphQLString },
      attack: { type: graphql.GraphQLInt },
      collectible: { type: graphql.GraphQLBoolean },
      cost: { type: graphql.GraphQLInt },
      dbfId: { type: graphql.GraphQLInt },
      durability: { type: graphql.GraphQLInt },
      flavor: { type: graphql.GraphQLString },
      health: { type: graphql.GraphQLInt },
      mechanics: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
      rarity: { type: graphql.GraphQLString },
      setId: { type: graphql.GraphQLString },
      text: { type: graphql.GraphQLString },
      type: { type: graphql.GraphQLString },
      tribe: { type: graphql.GraphQLString },
    })
  })

  return {
    GraphQLCard,
    GraphQLSet,
    GraphQLCardInput,
    GraphQLCardTranslation,
    GraphQLCardTranslationInput,
  }
}

