import * as graphql from "graphql"

export const getObjects = () => {
  const GraphQLSet = new graphql.GraphQLObjectType({
    name: `Set`,
    fields: () => ({
      id: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
    })
  })
  
  const GraphQLCard = new graphql.GraphQLObjectType({
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

  return {
    GraphQLCard,
    GraphQLSet
  }
}

