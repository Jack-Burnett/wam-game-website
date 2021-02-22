// server.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
var jwt = require('jsonwebtoken');
var path = require('path');


function getUser(token) {
  try {
    var decoded = jwt.verify(token, 'encryption_key');
    return decoded.uuid
  } catch(err) {
    return null
  }
}

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/
 
    // Get the user token from the headers.
    const token = req.headers.authorization || null

    if (token) {
      // try to retrieve a user with the token
      const user = getUser(token.replace("Bearer ", ""));
   
      // add the user to the context
      return { user };
    } else {
      return { }
    }

  },
});

app.use(express.static('public'))

server.applyMiddleware({ app });

//app.use((req, res) => {
//  res.status(200);
//  res.send('Hello!');
//  res.end();
//});

app.get(/.*/, function (req, res) {
  res.sendFile("./", options = { root: __dirname + '/../public' })
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)