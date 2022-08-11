import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { getObjects } from "../objects"
import { cards } from "./cards"
import { deck } from "./deck"

export type GraphqlObjects = ReturnType<typeof getObjects>

export type GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => GraphQLFieldConfig<any, any>

export const GraphqlResolvers = {
  cards,
  deck,
}