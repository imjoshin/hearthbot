import { IDatabase } from "../db/IDatabase"
import { GraphqlResolvers } from "./resolvers"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"
import { DependencyTree } from "../dependencies"

export const createSchema = (dependencies: DependencyTree) => {
  const types = getObjects()

  const fields: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const field of Object.values(GraphqlResolvers)) {
    fields[field.name] = field.resolver(types, dependencies)
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => fields,
  })
      
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot })
      
  return executableSchema
}