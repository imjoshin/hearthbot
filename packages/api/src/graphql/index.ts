import { GraphqlResolvers } from "./resolvers"
import { GraphqlMutations } from "./mutations"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"
import { DependencyTree } from "../util/DependencyTree"

export const createSchema = (dependencies: DependencyTree) => {
  const types = getObjects(dependencies)

  // create resolvers
  const resolvers: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const resolver of Object.values(GraphqlResolvers)) {
    resolvers[resolver.name] = resolver.resolver(types, dependencies)
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => resolvers,
  })

  // create mutations
  const mutations: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const mutation of Object.values(GraphqlMutations)) {
    mutations[mutation.name] = mutation.mutation(types, dependencies)
  }

  const MutationRoot = new graphql.GraphQLObjectType({
    name: `Mutation`,
    fields: () => mutations,
  })
      
  // create schema
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot, mutation: MutationRoot })
  console.log(JSON.stringify(executableSchema, null, 2))
      
  return executableSchema
}