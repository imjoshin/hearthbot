import * as graphql from "graphql"
import { IDatabase } from "../../db/IDatabase"
import { CardRepository } from "../../repository/CardRepository"
import { GraphqlResolverExport, GraphqlObjects } from "."

const Cards: GraphqlResolverExport = {
  name: `cards`,
  resolver: (objects: GraphqlObjects, db: IDatabase) => ({
    type: new graphql.GraphQLList(objects.GraphQLCard),
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: async () => {
      // TODO inject
      const cardRepository = new CardRepository(db)
      const cards = await cardRepository.getCards()
      return cards
    }
  }),
}


export default Cards