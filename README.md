# Fakeri
This bot will mainly be used for the Event

You can look at the code if you want

You need to have a Firebase Project for the bot to work

Set the neccesary keys in a .env file for the bot to connect to the DB:

```
FIREBASE_API_KEY=
FIREBASE_CONFIG_AUTH_DOMAIN=
FIREBASE_CONFIG_PROJECT_ID=
FIREBASE_CONFIG_STORAGE_BUCKET=
FIREBASE_CONFIG_MESSAGING_SENDER_ID=
FIREBASE_CONFIG_APP_ID=
```

Also set the bot token and bot client ID on the .env

```
DISCORD_TOKEN=
CLIENT_ID=
```

If you also want, you can set a testing bot discord token and client ID in the .env and use `node . test` to login to that bot

```
DISCORD_TEST_BOT_TOKEN=
TEST_BOT_CLIENT_ID=
```

You can also set the bot version in the .env for display in the /credits command
```
BOT_VERSION=1.0.0
```
