import { GraphqlMutationExport } from "."
import { DependencyTree } from "../../util/DependencyTree"
import { GraphqlObjects } from "../resolvers"
import { UserRepository } from "../../repository/UserRepository"
import { User } from "../../model/User"
import bcrypt from 'bcryptjs'

export const user: GraphqlMutationExport = (objects: GraphqlObjects, dependencies: DependencyTree) => ({
  permissions: {admin: true},
  type: objects.GraphQLUser,
  args: {
    user: { type: objects.GraphQLUserInput }, 
  },
  resolve: async (parent: any, args: any) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(args.user.password, salt)
    const set = new User({
      ...args.user,
      password: hashedPassword,
    })

    await dependencies.get(UserRepository).upsertUser(set)
    return set
  }
})