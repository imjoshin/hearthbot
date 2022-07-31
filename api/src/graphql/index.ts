import { IDatabase } from "../db/IDatabase"
import { makeExecutableSchema } from '@graphql-tools/schema'
import cards from "./resolvers/cards"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"

export const createSchema = () => {
  const types = getObjects()

  const fieldImports = [cards]
  const fields: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const field of fieldImports) {
    fields[field.name] = field.resolver(types)
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => fields,
  })
      
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot })
      
  return executableSchema
}