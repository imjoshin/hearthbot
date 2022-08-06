import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { default as createCard } from "./createCard"

export type GraphqlMutationExport = {
  name: string,
  mutation: (objects: GraphqlObjects, dependencies: DependencyTree) => GraphQLFieldConfig<any, any>,
}

export const GraphqlMutations = {
  createCard,
}