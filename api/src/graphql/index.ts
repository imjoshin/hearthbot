import { IDatabase } from "../db/IDatabase"
import { makeExecutableSchema } from '@graphql-tools/schema'
import cards from "./cards"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"

export type GraphqlExport = {
  name: string,
  resolver: GraphQLFieldConfig<any, any>,
}

export const createSchema = () => {
  const fieldImports = [cards]
  const fields: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const field of fieldImports) {
    fields[field.name] = field.resolver
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => fields,
  })
      
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot })
      
  return executableSchema
}