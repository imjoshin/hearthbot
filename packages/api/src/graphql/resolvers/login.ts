import { GraphqlResolverExport, GraphqlObjects } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphQLObjectType, GraphQLString } from "graphql"
import { UserRepository } from "../../repository/UserRepository"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PRIVATE_KEY } from "../../util/auth"

export const login: GraphqlResolverExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  type: new GraphQLObjectType({
    name: `Login`,
    fields: () => ({
      user: {type: objects.GraphQLUser},
      jwt: {type: GraphQLString},
    })
  }),
  args: {
    username: { type: GraphQLString }, 
    password: { type: GraphQLString }, 
  },
  resolve: async (_, args) => {
    const user = await dependencies.get(UserRepository).getUser(args.username)
    const correctPassword = await bcrypt.compare(args.password, user.password)

    if (!correctPassword) {
      throw new Error(`Invalid user`)
    }

    const token = jwt.sign({ username: user.username }, PRIVATE_KEY, {
      algorithm: `RS256`,
      expiresIn: `1h`,
    })

    await dependencies.get(UserRepository).updateUserLogin(args.username)

    return {
      user,
      jwt: token,
    }
  }
})