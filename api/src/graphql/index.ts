import { IDatabase } from "../db/IDatabase"
import { GraphqlResolvers } from "./resolvers"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"

export const createSchema = () => {
  const types = getObjects()

  const fields: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const field of Object.values(GraphqlResolvers)) {
    fields[field.name] = field.resolver(types)
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => fields,
  })
      
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot })
      
  return executableSchema
}