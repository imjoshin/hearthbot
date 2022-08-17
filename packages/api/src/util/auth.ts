import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { DependencyTree } from './DependencyTree'
import { UserRepository } from '../repository/UserRepository'
import { RequestHandler, Response } from 'express'
dotenv.config()

export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const PUBLIC_KEY = process.env.PUBLIC_KEY

export type PermissionsType = {
  canRead?: boolean, 
  canWrite?: boolean, 
  admin?: boolean,
}

export const validateAuthorization = (res: Response, required: PermissionsType) => {
  if (!required || !Object.keys(required).length) {
    return
  }
  
  if (
    required.canRead && !res.locals?.canRead ||
    required.canWrite && !res.locals?.canWrite ||
    required.admin && !res.locals?.admin
  ) {
    throw new Error(`Invalid permissions`)
  }
}

export const authorization = (dependencies: DependencyTree): RequestHandler => {
  return async (req, res, next) => {

    const authToken = req.get(`Authorization`)
    if (!authToken) {
      res.locals.auth = false
      return next()
    }

    const token = authToken.split(` `)[1]

    let verify
    try {
      verify = jwt.verify(token, PUBLIC_KEY)
    } catch (error) {
      res.locals.auth = false
      return next()
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const username: string = verify.username

    if (!username) {
      res.locals.auth = false
      return next()
    }

    const user = await dependencies.get(UserRepository).getUser(username)
    if (!user) {
      res.locals.auth = false
      return next()
    }

    res.locals.username = user.username
    res.locals.canRead = user.canRead
    res.locals.canWrite = user.canWrite
    res.locals.admin = user.admin
    next()
  }
}