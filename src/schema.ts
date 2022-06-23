import {gql} from "apollo-server"

export const typeDefs = gql`
type Match{
    nombre1: String!,
    nombre2: String!,
    resultado: [Int!]!,
    min: Int!,
    fin: Boolean!
}

type Query{
    listMatches:[Match]!,
    getMatch(id: String!): Match!,
}

type Mutation{
    setMatchData(id: String!, resultado: [Int]!, min: Int!, fin: Boolean!): String,
    startMatch (team1: String!, team2: String!): String
}

type Subscription{
    subscribeMatch(id: String!): Match,
}
`