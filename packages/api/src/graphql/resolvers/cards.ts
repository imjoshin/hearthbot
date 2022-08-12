import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql"

export const cards: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLCard),
  args: {
    name: { type: GraphQLString }, 
    locale: { type: GraphQLString }, 
    collectible: { type: GraphQLBoolean }, 
    cost: { type: objects.GraphQLRangeInput }, 
    health: { type: objects.GraphQLRangeInput }, 
    attack: { type: objects.GraphQLRangeInput }, 
    durability: { type: objects.GraphQLRangeInput }, 
    dbfIds: { type: GraphQLList(GraphQLInt) }, 
    rarity: { type: GraphQLString }, 
    mechanics: { type: GraphQLList(GraphQLString) }, 
    set: { type: GraphQLString },
    tribe: { type: GraphQLString },
    type: { type: GraphQLString },
    class: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const filter = {
      name: args.name,
      locale: args.locale,
      collectible: args.collectible,
      cost: args.cost,
      dbfIds: args.dbfIds,
      health: args.health,
      attack: args.attack,
      durability: args.durability,
      rarity: args.rarity,
      mechanics: args.mechanics,
      set: args.set,
      tribe: args.tribe,
      type: args.type,
      class: args.class,
    }
    const cards = await dependencies.get(CardRepository).getCards(filter)
    return cards
  }
})