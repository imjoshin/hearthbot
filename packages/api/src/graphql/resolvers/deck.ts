import { GraphqlResolverExport, GraphqlObjects } from "."
import { GraphQLNonNull, GraphQLString } from "graphql"
import { decode } from "deckstrings"

export const deck: GraphqlResolverExport = (objects: GraphqlObjects) => ({
  type: objects.GraphQLDeck,
  args: {
    code: { type: new GraphQLNonNull(GraphQLString) }, 
  },
  resolve: async (_, args) => {
    const decoded = decode(args.code)

    const cardDbfIds = []
    const cardCounts: {[key: number]: number} = {}
    for (const [dbfId, count] of decoded.cards) {
      cardDbfIds.push(dbfId)
      cardCounts[dbfId] = count
    }

    return {
      code: args.code,
      cardDbfIds,
      cardCounts,

      // TODO handle these, stringify them?
      format: decoded.format,
      hero: decoded.heroes[0]
    }
  }
})