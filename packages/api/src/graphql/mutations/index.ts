import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { card } from "./card"
import { cards } from "./cards"
import { createCardTranslation } from "./createCardTranslation"
import { createCardTranslations } from "./createCardTranslations"
import { createSet } from "./createSet"
import { createSets } from "./createSets"

export type GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => GraphQLFieldConfig<any, any>

export const GraphqlMutations = {
  card,
  cards,
  createCardTranslation,
  createCardTranslations,
  createSet,
  createSets,
}