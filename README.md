
# Books API: Your Personal Library in the Cloud 📚✨

Welcome to the Books API, where your digital library awaits! This isn't just any library; it's a place where stories live in the cloud, accessible from anywhere, anytime. Let's embark on a journey to set up this magical realm where your favorite tales and tomes reside.

## Prerequisites: Your Magical Toolkit 🧙‍♂️

Before we begin, ensure you have these enchanted tools at your disposal:

- **Node.js**: The spellbinding engine that powers our library. Grab it from [Node.js](https://nodejs.org/).
- **Docker**: Our mystical container that encapsulates all the magic in one place. Summon it from [Docker](https://www.docker.com/products/docker-desktop).
- **Yarn**: A powerful spellweaver for managing our magical scripts (optional). Invoke it from [Yarn](https://yarnpkg.com/).

## Setting Up the Enchanted Grounds

### 1. Cloning the Spellbook

First, let's clone the repository of spells into your local enchantment workspace:

```bash
git clone https://github.com/CyberX6/books-api.git
cd books-api
```

### 2. Unleashing the Magic Box with Docker

For those who prefer their magic pre-packaged, Docker is your go-to:

```bash
docker-compose up
```

This incantation prepares everything you need, including our library and the mystical PostgreSQL database, housed at `localhost:5432` (default realm).

### 3. Gathering the Spells with NPM or Yarn

Not using Docker? Fear not, for you can manually conjure the dependencies:

With NPM:
```bash
npm install
```

Or with Yarn, for those who weave their spells differently:
```bash
yarn
```

### 4. Awakening the Library

Bring the library to life:

Using NPM:
```bash
npm run start
```

For development spells:
```bash
npm run start:dev
```

Or, with Yarn:
```bash
yarn start
```

And for development:
```bash
yarn start:dev
```

## Interacting with Your Digital Library

- **Add a New Book**: Use the mystical endpoints detailed in our API grimoire.
- **Explore Your Collection**: Command the API to reveal your curated collection of books.

## The Library's Backbone

### The Tome Repository (PostgreSQL Database)

Our library's foundation is built on PostgreSQL, a robust database that Docker conjures up seamlessly. Outside of Docker's realm, ensure you have PostgreSQL installed and running in your local environment. By default, our database resides within the Docker container, accessible at `localhost:5432`.

### Planting Knowledge Seeds (Seed Data)

Populate your library with initial volumes of lore using:

```bash
npm run seed:run
```

Or with Yarn:
```bash
yarn seed:run
```

This will sow the seeds of a starting collection in your library.

### Evolving the Library (Migrations)

As our collection grows, so must our library. To reshape its structure:

```bash
npm run migrate:run
```

Or, for Yarn users:
```bash
yarn migrate:run
```

## Discover More Spells (API Documentation)

Unlock the full potential of your library by visiting the API documentation at `http://localhost:3000/docs`. Here lies every spell you can cast upon your collection.

## Contributing to the Grand Library

Every wizard, witch, and scholar is welcome to contribute to the Books API. Whether it's by adding new features, fixing bugs, or improving the magic spells, your knowledge will help the library flourish.

## Share the Magic

This library is shared under the MIT License, allowing you to use, modify, and spread the magic far and wide. Let's create a world where knowledge and stories are accessible to everyone!
