import { GraphQLFieldConfig } from "graphql"
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { card } from "./card"
import { cards } from "./cards"
import { cardTranslation } from "./cardTranslation"
import { cardTranslations } from "./cardTranslations"
import { cardSet } from "./cardSet"
import { cardSets } from "./cardSets"
import { user } from "./user"
import { PermissionsType } from "../../util/auth"

export type GraphqlMutationExport = 
(objects: GraphqlObjects, dependencies: DependencyTree) => 
GraphQLFieldConfig<any, any> & { permissions?: PermissionsType}

export const GraphqlMutations = {
  card,
  cards,
  cardTranslation,
  cardTranslations,
  cardSet,
  cardSets,
  user,
}