import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLList } from "graphql"
import { UserRepository } from "../../repository/UserRepository"
import { validateAuthorization } from "../../util/auth"

export const users: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLList(objects.GraphQLUser),
  resolve: async (parents, args, context, info) => {
    validateAuthorization(context.res, {admin: true})
    const users = await dependencies.get(UserRepository).getUsers()
    return users
  }
})