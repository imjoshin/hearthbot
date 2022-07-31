import * as graphql from "graphql"
import { GraphqlExport } from "."
import { GraphQLCard } from "./types"

const Cards: GraphqlExport = {
  name: `cards`,
  resolver: {
    type: new graphql.GraphQLList(GraphQLCard),
    resolve: (parent, args, context, resolveInfo) => {
      return [
        {name: `test`, id: `id`, set: `setid`},
        {name: `test2`, id: `id2`, set: `setid2`}
      ]
    }
  },
}


export default Cards