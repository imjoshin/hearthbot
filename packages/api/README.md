# Hearthbot API

This is the API behind the Hearthbot project.

## Setup

Upon initial setup, the API will have no users. 

If the db has no administrators, the [user](#user) mutation will require no permissions. The first step is to add an admin user.

```
mutation {
  user (user:{username:"{USER}", password:"{PASSWORD}", admin: true}) {
    username,
  }
}
```

## Usage

TODO: auth, JWT, etc

## API Docs

### Resolvers

#### `cards`

Grabs cards based on certain parameters. 

Required user permissions:
- `canRead`

TODO args:

```
name: { type: GraphQLString }, 
locale: { type: GraphQLString }, 
collectible: { type: GraphQLBoolean }, 
cost: { type: objects.GraphQLRangeInput }, 
health: { type: objects.GraphQLRangeInput }, 
attack: { type: objects.GraphQLRangeInput }, 
durability: { type: objects.GraphQLRangeInput }, 
dbfIds: { type: GraphQLList(GraphQLInt) }, 
rarity: { type: GraphQLString }, 
mechanics: { type: GraphQLList(GraphQLString) }, 
set: { type: GraphQLString },
tribe: { type: GraphQLString },
type: { type: GraphQLString },
class: { type: GraphQLString },
school: { type: GraphQLString },
```

#### `cardSets`

Grabs card sets.

Required user permissions:
- `canRead`

TODO args:
```
released: { type: GraphQLBoolean }, 
hasScrapeUrl: { type: GraphQLBoolean },
prerelease: { type: GraphQLBoolean },
```

#### `deck`

Grabs card objects for a given deck code.

Required user permissions:
- `canRead`

TODO args:
```
code: { type: new GraphQLNonNull(GraphQLString) }, 
```

#### `login`

Gets a JWT for authorization.

Required user permissions:
- `canRead`

TODO args:
```
username: { type: GraphQLString }, 
password: { type: GraphQLString }, 
```

#### `users`

Gets user objects.

Required user permissions:
- `admin`


### Mutations

#### card

Upserts a card, keying on the card ID.

Required user permissions:
- `canWrite`

TODO args:
```
id: { type: GraphQLString },
artist: { type: GraphQLString },
attack: { type: GraphQLInt },
classes: { type: new GraphQLList(GraphQLString) },
collectible: { type: GraphQLBoolean },
cost: { type: GraphQLInt },
dbfId: { type: GraphQLInt },
durability: { type: GraphQLInt },
flavor: { type: GraphQLString },
health: { type: GraphQLInt },
mechanics: { type: new GraphQLList(GraphQLString) },
name: { type: GraphQLString },
rarity: { type: GraphQLString },
setId: { type: GraphQLString },
text: { type: GraphQLString },
type: { type: GraphQLString },
tribe: { type: GraphQLString },
image: { type: GraphQLString },
school: { type: GraphQLString },
```

#### cards

Upserts multiple cards, keying on the card ID.

Required user permissions:
- `canWrite`

TODO args:
```
cards: { type: GraphQLList(objects.GraphQLCardInput) }, 
```

#### cardSet

Upserts a card set, keying on the set ID.

Required user permissions:
- `canWrite`

TODO args:
```
id: { type: new GraphQLNonNull(GraphQLString) },
fullName: { type: GraphQLString },
shortName: { type: GraphQLString },
scrapeUrl: { type: GraphQLString },
releaseDate: { type: GraphQLString },
```

#### cardSets

Upserts multiple card sets, keying on the set ID.

Required user permissions:
- `canWrite`

TODO args:
```
sets: { type: GraphQLList(objects.GraphQLSetInput) }, 
```

#### cardTranslation

Upserts a card translation, keying on the card ID and locale.

Required user permissions:
- `canWrite`

TODO args:
```
cardId: { type: new GraphQLNonNull(GraphQLString) },
locale: { type: new GraphQLNonNull(GraphQLString) },
text: { type: GraphQLString },
flavor: { type: GraphQLString },
name: { type: new GraphQLNonNull(GraphQLString) },
```

#### cardTranslations

Upserts multiple card translations, keying on the card ID and locale.

Required user permissions:
- `canWrite`

TODO args:
```
translations: { type: GraphQLList(objects.GraphQLCardTranslationInput) }, 
```

#### user

Upserts an API user, keying on the username.

Required user permissions:
- `admin`

TODO args:
```
username: { type: new GraphQLNonNull(GraphQLString) },
password: { type: new GraphQLNonNull(GraphQLString) },
admin: { type: GraphQLBoolean },
canRead: { type: GraphQLBoolean },
canWrite: { type: GraphQLBoolean },
```