import * as graphql from "graphql"
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
  
  const GraphQLCard = new graphql.GraphQLObjectType({
    name: `Card`,
    fields: () => ({
      id: { type: graphql.GraphQLString },
      artist: { type: graphql.GraphQLString },
      attack: { type: graphql.GraphQLInt },
      collectible: { type: graphql.GraphQLBoolean },
      cost: { type: graphql.GraphQLInt },
      dbfId: { type: graphql.GraphQLInt },
      flavor: { type: graphql.GraphQLString },
      health: { type: graphql.GraphQLInt },
      mechanics: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
      rarity: { type: graphql.GraphQLString },
      setId: { type: graphql.GraphQLString },
      text: { type: graphql.GraphQLString },
      type: { type: graphql.GraphQLString },
      tribe: { type: graphql.GraphQLString },
      set: {
        type: GraphQLSet,
        async resolve(card) {
          return dependencies.get(SetRepository).getSet(card.setId)
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
  }
}

