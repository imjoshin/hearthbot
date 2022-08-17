import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLList } from "graphql"
import { UserRepository } from "../../repository/UserRepository"

export const users: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  permissions: {admin: true},
  type: new GraphQLList(objects.GraphQLUser),
  resolve: async () => {
    const users = await dependencies.get(UserRepository).getUsers()
    return users
  }
})