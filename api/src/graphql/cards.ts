import { GraphqlExport } from "."

export const typeDefs = `
type Set {
  id: ID!
  name: String!
}

type Card {
  id: ID!
  name: String!
  set: Set
}


type Query {
  cards: [Card]
  card: Card
  set: Set
}
`

export const resolvers = {
  cards: (obj: object, args: object, context: object) => {
    console.log({obj, args, context})

    return [
      {name: `test`, id: `id`, set: `setid`}
    ]
  },
  set: (obj: object, args: object, context: object) => {
    console.log({obj, args, context})

    return [
      {name: `set1`, id: `setid`}
    ]
  },
}

const Cards: GraphqlExport = {
  typeDefs,
  resolvers,
}


export default Cards