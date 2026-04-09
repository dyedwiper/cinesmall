# Cinesmall - An example for DDD vs. CRUD

This repo contains implementations of the same example domain with different approaches.

## Domain

The domain is taken from the book [Domain Driven Transformation](https://dpunkt.de/produkt/domain-driven-transformation/).

![image](./images/cinesmall%20domain.jpeg)

### Hints

- As you see it is a German book. Though it is often recommended in DDD, I don't like non-english words in the code, so I translated the domain language.
- I left out a few parts of the domain and added more detail to others.
- A few business rules might differ slightly in the different apps. If so it is unintentionally and due to lack of time and need.

## Different approaches

The code lies in the respective folders.

### DDD

This takes a classical Domain Driven Design approach dividing the code into bounded contexts and using object-oriented Design patterns. The used patterns are inspired by [Khalil Stemmler's articles on DDD with TypeScript](https://khalilstemmler.com/articles/domain-driven-design-intro/). The code is also divided horizontally as described by [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and [Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/).

#### Hints

- The repo method `saveWeekplan` is quite complicated and would grow more complicated with a growing subdomain. Maybe there are smarter solutions for it but maybe it is an inevitable downside of saving a whole aggregate.

### CRUD

This takes a classical CRUD approach having one route and one service per resource (or database table).

#### Hints

- In the weekplan route there are already two GET endpoints with unpleasantly specific paths and names of the respective service methods. With a growing domain such namings will get more tedious.
- With the current domain the types inferred from the database tables are enough to work with, but with a growing domain one might need more specific types which could lead to tedious namings (like with the paths and methods above).

## Running and testing the apps

All of the apps are working.

To run them you need a Postgres database. Here is a guide how to set it up locally: https://orm.drizzle.team/docs/guides/postgresql-local-setup. After setting it up, you need to create an .env file in each app's folder with `DATABASE_URL` set to the connection string.

Then you just need to go the respective folder, run `npm i` and `npm run dev`.

In the folder _http-requests_ you find requests that you can use with the [REST client for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
