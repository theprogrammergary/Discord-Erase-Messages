# Discord Bot README

## Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Create a `.env` file in the root directory mocking the `.env copy` file.
4. Run the bot using `npm start`.

## How it works

1. CLI asks for

   - Search terms
   - SERVER ID
   - AUTHOR ID

2. Using user token, we call the USER API to search for messages based on cli inputted content. Bots are not allowed to use this API; therefore, to only use a bot you would have to fetch all messages in a server.

3. If messages are found with the content the CLI asks if you want to delete those messages

4. CLI restarts.
