import { GraphqlResolvers } from "./resolvers"
import { GraphqlMutations } from "./mutations"
import * as graphql from "graphql"
import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "./objects"
import { DependencyTree } from "../util/DependencyTree"
import { validateAuthorization } from "../util/auth"

export const createSchema = (dependencies: DependencyTree) => {
  const objects = getObjects(dependencies)

  // create resolvers
  const resolvers: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const [name, resolver] of Object.entries(GraphqlResolvers)) {
    const r = resolver(objects, dependencies)
    resolvers[name] = {
      ...r,
      resolve: (...args) => {
        const context = args[2]
        validateAuthorization(context.res, r.permissions)
        return r.resolve(...args)
      }
    }
  }

  const QueryRoot = new graphql.GraphQLObjectType({
    name: `Query`,
    fields: () => resolvers,
  })

  // create mutations
  const mutations: {[key: string]: GraphQLFieldConfig<any, any>} = {}
  for (const [name, mutation] of Object.entries(GraphqlMutations)) {
    mutations[name] = mutation(objects, dependencies)
    const m = mutation(objects, dependencies)
    mutations[name] = {
      ...m,
      resolve: (...args) => {
        const context = args[2]
        validateAuthorization(context.res, m.permissions)
        return m.resolve(...args)
      }
    }
  }

  const MutationRoot = new graphql.GraphQLObjectType({
    name: `Mutation`,
    fields: () => mutations,
  })
      
  // create schema
  const executableSchema = new graphql.GraphQLSchema({ query: QueryRoot, mutation: MutationRoot })
      
  return executableSchema
}