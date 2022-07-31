import { GraphQLFieldConfig } from "graphql"
import { IDatabase } from "../../db/IDatabase"
import { getObjects } from "../objects"
import { default as cards } from "./cards"

export type GraphqlObjects = ReturnType<typeof getObjects>

export type GraphqlResolverExport = {
  name: string,
  resolver: (objects: GraphqlObjects, db: IDatabase) => GraphQLFieldConfig<any, any>,
}

export const GraphqlResolvers = {
  cards,
}