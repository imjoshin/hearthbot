import * as graphql from "graphql"

export const GraphQLSet = new graphql.GraphQLObjectType({
  name: `Set`,
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  })
})

export const GraphQLCard = new graphql.GraphQLObjectType({
  name: `Card`,
  fields: () => ({
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    set: {
      type: GraphQLSet,
      resolve(card) {
        return {id: 1, name: `Project: ${card.id}, Member: 1`}
      }
    }
  })
})