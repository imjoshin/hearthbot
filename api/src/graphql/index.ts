import { IDatabase } from "../db/IDatabase"
import { makeExecutableSchema } from '@graphql-tools/schema'
import cards from "./cards"
import * as graphql from "graphql"

export type GraphqlExport = {
  typeDefs: string,
  resolvers: {
    [key: string]: (obj: object, args: object, context: object) => object,
  }
}

export const createSchema = (db: IDatabase) => {
  // const sections = [cards]
  
  // const typeDefs = sections.map(s => s.typeDefs).join(`\n`)

  // let queryResolvers = {}
  // for (const section of sections) {
  //   queryResolvers = {
  //     ...queryResolvers,
  //     ...section.resolvers,
  //   }
  // }

  // const resolvers = {
  //   Query: queryResolvers,
  // }

  // const executableSchema = makeExecutableSchema({
  //   typeDefs,
  //   resolvers,
  // })

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
  
  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => ({
      cards: {
        type: new graphql.GraphQLList(GraphQLCard),
        resolve: (parent, args, context, resolveInfo) => {
          
          console.log({parent, args, resolveInfo})
          console.log(resolveInfo.fieldNodes)

          return [
            {name: `test`, id: `id`, set: `setid`}
          ]
        }
      },
      card: {
        type: GraphQLCard,
        resolve: (parent, args, context, resolveInfo) => {
          
          console.log({parent, args, resolveInfo})

          return {name: `test`, id: `id`, set: `setid`}
        }
      }
    })
  })
      
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot })
      
  return executableSchema
}