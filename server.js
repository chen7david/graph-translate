const { ApolloServer, gql } = require('apollo-server')
const { PORT, HOST } = require('./config')
const controller = require('./controller')
const typeDefs = gql`
    type Word {
        text: String!
        ipa: String!
        zh: String!
    }

    type Query {
        words(text: String!): [Word]!
    }
`
const resolvers = {
    Query: {
        words: controller.words
    },
}

const server = new ApolloServer({
    cors: {
        origin: '*',            
        credentials: true
    },
    typeDefs,
    resolvers
})

server.listen(PORT || 5000, HOST).then(({url}) => { console.log(`server running at ${url}`)})