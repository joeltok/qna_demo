# Demo Microsoft QnA Chat Interface repo

## Setup and Installation

```sh
git clone TODO
yarn
cp .env.local.example .env.local
```

## Usage

### Start Backend

The backend consists of a simple http node.js server, which is able to accept WebSocket connections. WebSocket is chosen over HTTP/HTTPS because its capabilities more closely mimics real life chat interface expectations. For example, in chat interfaces, it can be common for human participants to request for other chat participants to wait while they complete a task. Once a task is completed, the human participant then updates the other participants about progress. Such behaviour is easily implemented using WebSockets - and is something we make use of in one of our error-handling scenarios.

When questions are received, this backend server bounces the questions over to Microsoft's QnA bot, and then handles the answer according to the following rules:
1) If an answer is received, and the confidence of the answer exceeds 90, the answer is relayed to the Frontend chat.
2) If an answer is received, but the confidence of the answer is less than or equal to 90, the bot simulates a fallback to a human operator.
3) If no answer is received, a server error is assumed, and a reply is returned indicating this. A callback is then invoked using setTimout to indicate to the user to try again after 2 seconds are up.

```sh
node index.js
```

### Start Frontend App

The frontend consists of a simple React app with basic chat interface. Nothing fancy.

```sh
npm start
```

Then access the page at http://localhost:3000

## Resources
FAQ Page: https://www.amazon.com/gp/help/customer/display.html?nodeId=201602230
Simple Bot Persona Responses: http://halo.wikia.com/wiki/343_Guilty_Spark/Quotes
