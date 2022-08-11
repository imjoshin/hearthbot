import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { card } from "./card"
import { cards } from "./cards"
import { cardTranslation } from "./cardTranslation"
import { cardTranslations } from "./cardTranslations"
import { createSet } from "./createSet"
import { createSets } from "./createSets"

export type GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => GraphQLFieldConfig<any, any>

export const GraphqlMutations = {
  card,
  cards,
  cardTranslation,
  cardTranslations,
  createSet,
  createSets,
}