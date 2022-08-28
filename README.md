<p align="center">
  <img alt="Hearthbot Logo" src="./git-logo.png" width="500" />
</p>

<p align="center">
  Hearthbot is a bot for Discord that aids in conversation between Hearthstone players. By combining multiple data sources, the Hearthbot API has the most up-to-date card data, including unreleased cards. 
</p>

## Packages

| Name      | Description |
|----------------|-------|
| API     | The GraphQL API that backs the project |
| Bot     | The Discord.js bot that users interact with |
| Scrape  | The cron job that scrapes new card sets from hearthstonetopdecks.com |
| Sync    | The cron job that syncs data from hearthstonejson.com |

```mermaid
graph LR
Scrape[Scrape] --> API{API}
Sync[Sync] --> API
API --> Bot((Bot))
Bot --> API
```

## Setup
Note: each service (besides the API) requires API credentials. You can read more about the `createUser` mutation in the [API docs](/packages/api/README.md).

### [API](/packages/api/)
```
$ sudo apt install mysql-server
$ sudo mysql_secure_installation
$ sudo mysql
> CREATE DATABASE hearthbot;
> exit;
$ cd packages/api
$ yarn install
$ cp .env.example .env
```

After mysql is installed and the `.env` is copied, fill out the information in `.env`.
Then run:
```
yarn dev
```

### [Bot](/packages/bot/)

```
$ cd packages/bot
$ yarn install
$ cp .env.example .env # fill in .env before continuing
$ yarn dev
```

### [Scrape](/packages/scrape/)

```
$ cd packages/scrape
$ yarn install
$ cp .env.example .env # fill in .env before continuing
$ yarn dev
```

### [Sync](/packages/sync/)

```
$ cd packages/sync
$ yarn install
$ cp .env.example .env # fill in .env before continuing
$ yarn dev
```

## Where can I help?

I'm always looking for ideas and contributions! If there's something you believe is worth adding, feel free to open a PR.

Two immediate things that could be taken care of:

1. Testing - jest is all set up, just need to add tests
2. Common code - `logging.ts` and `api.ts` within each package needs to be pulled out into a common package.

<p align="center">
  <a href="https://www.buymeacoffee.com/hydroto">
    <img alt="Buy me a coffee" src="https://cdn.buymeacoffee.com/buttons/v2/arial-yellow.png" width="200">
  </a>
</p>