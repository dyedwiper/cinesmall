# Cinesmall - An example for DDD vs. CRUD

This repo contains TypeScript implementations of the same example domain with different approaches.

As frameworks I used [Hono](https://hono.dev/) and [Drizzle](https://orm.drizzle.team/).

## Domain

The domain is taken from the book [Domain Driven Transformation](https://dpunkt.de/produkt/domain-driven-transformation/).

![image](./images/cinesmall%20domain.jpeg)

### Hints

- As you see it is a German book. Though it is often recommended in DDD, I don't like non-english words in the code, so I translated the domain language.
- I left out a few parts of the domain and added more detail to others because it seemed more fitting to carve out the architectural concepts.

## Different approaches

The code lies in the respective folders.

### DDD

This takes a classical Domain Driven Design approach dividing the code into bounded contexts and using object-oriented Design patterns. The used patterns are inspired by [Khalil Stemmler's articles on DDD with TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/). The code is also divided horizontally as described by [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/).

### CRUD

This takes a classical CRUD approach having one route and one service per resource (or database table).

## Running and testing the apps

All of the apps are working.

To run them you need a Postgres database. Here is a guide how to set it up locally: https://orm.drizzle.team/docs/guides/postgresql-local-setup. After setting it up, you need to create an .env file with the connection details. The file .env.example gives orientation how it should look like.

Then you just need to go the respective folder, run `npm i`, `npm run push-schema` and `npm run dev`.

In the folder _http-requests_ you find requests that you can use with the [REST client for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
