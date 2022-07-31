import { GraphQLFieldConfig } from "graphql"
import { getObjects } from "../objects"
import { default as cards } from "./cards"

export type GraphqlObjects = ReturnType<typeof getObjects>

export type GraphqlResolverExport = {
  name: string,
  resolver: (objects: GraphqlObjects) => GraphQLFieldConfig<any, any>,
}

export const GraphqlResolvers = {
  cards,
}