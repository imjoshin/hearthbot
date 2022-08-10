import { GraphqlResolvers } from "./resolvers"
import { GraphqlMutations } from "./mutations"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"
import { DependencyTree } from "../util/DependencyTree"

export const createSchema = (dependencies: DependencyTree) => {
  const objects = getObjects(dependencies)

  // create resolvers
  const resolvers: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const [name, resolver] of Object.entries(GraphqlResolvers)) {
    resolvers[name] = resolver(objects, dependencies)
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => resolvers,
  })

  // create mutations
  const mutations: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const [name, mutation] of Object.entries(GraphqlMutations)) {
    mutations[name] = mutation(objects, dependencies)
  }

  const MutationRoot = new graphql.GraphQLObjectType({
    name: `Mutation`,
    fields: () => mutations,
  })
      
  // create schema
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot, mutation: MutationRoot })
      
  return executableSchema
}