import * as graphql from "graphql"
import { GraphqlResolverExport, GraphqlObjects } from "."

const Cards: GraphqlResolverExport = {
  name: `cards`,
  resolver: (objects: GraphqlObjects) => ({
    type: new graphql.GraphQLList(objects.GraphQLCard),
    // resolve: (parent, args, context, resolveInfo) => {
    resolve: () => {
      return [
        {name: `test`, id: `id`, set: `setid`},
        {name: `test2`, id: `id2`, set: `setid2`}
      ]
    }
  }),
}


export default Cards