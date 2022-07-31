import * as graphql from "graphql"
import { IDatabase } from "./db/IDatabase"
import joinMonster from "join-monster"


export const createSchema = (db: IDatabase) => {
  const GraphQLCard = new graphql.GraphQLObjectType({
    name: `Card`,
    extensions: {
      joinMonster: {
        sqlTable: `card`,
        uniqueKey: `id`,
      }
    },
    fields: () => ({
      id: { type: graphql.GraphQLString },
      name: { type: graphql.GraphQLString },
    })
  })
  
  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => ({
      cards: {
        type: new graphql.GraphQLList(GraphQLCard),
        resolve: (parent, args, context, resolveInfo) => {
          return joinMonster(resolveInfo, {}, (sql: string) => {
            console.log(sql)
            return db.run(sql)
          })
        }
      }
    })
  })
      
  return new graphql.GraphQLSchema({ query: QueryRoot })
}