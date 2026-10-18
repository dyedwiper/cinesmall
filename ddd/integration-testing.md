For a new TypeScript project I recently had to come up with a concept for integration testing. It was already decided that we will use the following technologies:

- [PostgreSQL](https://www.postgresql.org/) as database
- [Drizzle](https://orm.drizzle.team/) as ORM framework
- [Vitest](https://vitest.dev/) as testing framework

I didn't find much on the topic but the article [How to Test Your Node.js & Postgres App Using Drizzle & PGlite](https://dev.to/danielubenjamin/how-to-test-your-nodejs-postgres-app-using-drizzle-pglite-4fb3). So I took it as a starting point and implemented a POC with PGlite but wasn't really happy with it because it seemed quite slow. I then thought about [Testcontainers](https://testcontainers.com/) which was discouraged in the article and also to me, creating throwaway containers sounded like a lot of overhead. Then a friend had the idea to create throwaway databases in a running PostgreSQL instance instead. I liked it as it sounded less cumbersome.

In the end I came up with four approaches, first the approach with PGlite and then three different approaches for creating throwaway databases in a running PostgreSQL instance. Following I'll introduce the implementations and show some measurements I took on the performance.

I implemented the POCs in a repository I created a while ago for architectural analysis: https://github.com/dyedwiper/cinesmall You can find the respective code in the "ddd" folder and in the branches called "int-tests-\*".

## General notes on the usage of Vitest and Drizzle

All approaches make use of Vitest's [setupFiles](https://vitest.dev/config/setupfiles) and some of [globalSetup](https://vitest.dev/config/globalsetup).

For pushing the schema programmatically I used a function from drizzle-kit which is not documented. I read about it in a discussion on Github: [Push schema programatically?](https://github.com/drizzle-team/drizzle-orm/discussions/4373)

## General notes on the tests

In all approaches I used the same tests. I also added some unit tests to see how they can be distinguished from integration tests. Although this is a different topic, I left them in because I don't think it distracts too much.

Writing the integration tests I especially took care that they fail if the database is not correctly cleaned up between tests. Here is the code from one of the integration test files:

```ts
describe('addScreening', () => {
    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });

    test('adds a screening', async () => {
        const weekplanId = crypto.randomUUID();
        await db.insert(weekplans).values({ id: weekplanId, startDate: '2026-07-16' });

        const dto = {
            weekplanId: weekplanId,
            date: '2026-07-17',
            hallNumber: 1,
            film: 'Xaver und sein außerirdischer Freund',
            duration: 90,
        };
        await addScreening(dto);

        const result = await db.query.weekplans.findFirst({
            where: { id: weekplanId },
            with: { screenings: true },
        });
        expect(result?.screenings).toHaveLength(1);
    });

    test('db is cleared after each test', async () => {
        const screenings = await db.query.screenings.findMany();

        expect(screenings).toHaveLength(0);
    });
});
```

You can find the above test file here (or in the other branches respectively): https://github.com/dyedwiper/cinesmall/blob/int-tests-pglite/ddd/src/contexts/weekplanning/useCases/addScreening.uc.int-test.ts

## The different approaches

### 1. Create a PGlite database for each test file

In the [Vitest config](https://github.com/dyedwiper/cinesmall/blob/int-tests-pglite/ddd/vitest.config.ts) a setupFile is specified to run before each test:

```ts
export default defineProject({
    test: {
        // ...
        projects: [
            {
                test: {
                    name: 'Integration Tests',
                    include: [`**/*.int-test.ts`],
                    setupFiles: 'src/shared/test/dbSetup.ts',
                },
            },
            {
                test: {
                    name: 'Unit Tests',
                    include: [`**/*.test.ts`],
                },
            },
        ],
    },
});
```

In the [setupFile](https://github.com/dyedwiper/cinesmall/blob/int-tests-pglite/ddd/src/shared/test/dbSetup.ts) the drizzle instance is mocked with an instance connected to PGlite. The package [@electric-sql/pglite](https://github.com/electric-sql/pglite) is used to create the PGlite instance.

Also an `afterEach` hook is added to clear the database after each test.

```ts
const db = drizzle({ client: new PGlite(), relations: schema.relations });
await (await pushSchema(schema, db)).apply();

// Inspired by https://github.com/drizzle-team/drizzle-orm/issues/4205
vi.doMock(import('../db/index.js'), async () => ({ db }));

afterEach(async () => {
    await reset(db, schema);
});
```

### 2. Creating one throwaway database for all test files

Here, the idea is to spin up a database in globalSetup and clean it up between all tests.

The project in the [Vitest config](https://github.com/dyedwiper/cinesmall/blob/int-tests-global/ddd/vitest.config.ts) looks like this:

```ts
                test: {
                    name: 'Integration Tests',
                    include: [`**/*.int-test.ts`],
                    env: loadEnv('test', process.cwd(), ''),
                    globalSetup: 'src/shared/test/globalSetup.ts',
                    setupFiles: 'src/shared/test/clearDb.ts',
                    fileParallelism: false,
                },
```

There are two important things here:

- Environment variables are loaded from [.env.test](https://github.com/dyedwiper/cinesmall/blob/int-tests-global/ddd/.env.test) which contains the connection to the PostgreSQL instance. These will then be available to the tests, see: https://vitest.dev/config/env. (Locally you can use the same instance that you use for running the app, you just need to set PGDATABASE to a different name.)
- [fileParellelism](https://vitest.dev/config/fileparallelism#fileparallelism) is set to false. Running the test files in parallel on the same database will fail. You can try it out by turning it on.

In [globalSetup](https://github.com/dyedwiper/cinesmall/blob/int-tests-global/ddd/src/shared/test/globalSetup.ts) the test database is created and then the schema is pushed to it. (You need two pools, the first to create the database and the second to connect to it.)

```ts
// This name must be the same as PGDATABASE in .env.test
const testDbName = `cinesmall-test`;

export async function setup() {
    process.loadEnvFile();

    const pool1 = new Pool();
    await pool1.query(`CREATE DATABASE "${testDbName}";`);
    await pool1.end();

    const pool2 = new Pool({ database: testDbName });
    const db = drizzle({ client: pool2, relations: schema.relations });
    await (await pushSchema(schema, db)).apply();
    await pool2.end();
}

export async function teardown() {
    const pool = new Pool();
    await pool.query(`DROP DATABASE "${testDbName}";`);
    await pool.end();
}
```

Because of the above mentioned env config, all tests will use this database. The [setupFile](https://github.com/dyedwiper/cinesmall/blob/int-tests-global/ddd/src/shared/test/clearDb.ts) just adds an `afterEach` to clear the database between each test.

```ts
afterEach(() => {
    reset(db, schema);
});
```

### 3. Creating a throwaway database for each test file

As mentioned above you need to run test files sequentially when using a single database for all. This is not the case when you create a distinct database for each test file.

The database is created in the [setupFile](https://github.com/dyedwiper/cinesmall/blob/int-tests-create/ddd/src/shared/test/dbSetup.ts).

```ts
process.loadEnvFile();

const dbName = `cinesmall-test-${crypto.randomUUID()}`;

const adminPool = new Pool();
await adminPool.query(`CREATE DATABASE "${dbName}";`);

const testPool = new Pool({ database: dbName });
const db = drizzle({ client: testPool, relations: schema.relations });
await (await pushSchema(schema, db)).apply();

// Inspired by https://github.com/drizzle-team/drizzle-orm/issues/4205
vi.doMock(import('../db/index.js'), async () => ({ db }));

afterEach(async () => {
    await reset(db, schema);
});

afterAll(async () => {
    await testPool.end();
    await adminPool.query(`DROP DATABASE "${dbName}";`);
    await adminPool.end();
});
```

Unlike in the previous approach and similar to the PGlite approach, the drizzle instance is mocked with an instance that is connected to the throwaway database.

### 4. Creating a throwaway database from a template for each test file

In PostgreSQL it is possible to [create databases from custom templates](https://www.postgresql.org/docs/current/manage-ag-templatedbs.html). A colleague suspected this could be faster than pushing the schema to each throwaway database.

In [globalSetup](https://github.com/dyedwiper/cinesmall/blob/int-tests-template/ddd/src/shared/test/globalSetup.ts) such a template database is created and the schema is pushed to it:

```ts
const templateDbName = 'cinesmall-test-template';

export async function setup() {
    process.loadEnvFile();

    const pool1 = new Pool();
    await pool1.query(`CREATE DATABASE "${templateDbName}";`);
    await pool1.end();

    const pool2 = new Pool({ database: templateDbName });
    const db = drizzle({ client: pool2, relations: schema.relations });
    await (await pushSchema(schema, db)).apply();
    await pool2.end();
}

// ...
```

Then in the [setupFile](https://github.com/dyedwiper/cinesmall/blob/int-tests-template/ddd/src/shared/test/globalSetup.ts) the throwaway database is created from this template:

```ts
process.loadEnvFile();

const dbName = `cinesmall-test-${crypto.randomUUID()}`;

const adminPool = new Pool();
await adminPool.query(`CREATE DATABASE "${dbName}" TEMPLATE "cinesmall-test-template";`);

const testPool = new Pool({ database: dbName });
const db = drizzle({ client: testPool, relations: schema.relations });

// Inspired by https://github.com/drizzle-team/drizzle-orm/issues/4205
vi.doMock(import('../db/index.js'), async () => ({ db }));

// ...
```

The rest works just the same as in the third approach.

## Performance comparison

For the measurements it was important to be aware of [Vitest's handling of parallelism](https://vitest.dev/guide/parallelism), especially that "By default, Vitest runs test files in parallel across multiple workers." In the second approach tests have to run sequentially but for the others it is sensible to make use of parallelism. To make the measurements more reliable I set [maxWorkers](https://vitest.dev/config/maxworkers) because otherwise Vitest asks the OS for available parallelism and that can vary depending on what your machine is doing besides. I set it to 4 because this seemed low enough that my machine is always capable of handling it and also high enough to see an impact compared to running the tests sequentially.

I created 20 copies of [clean.int-test.ts](https://github.com/dyedwiper/cinesmall/blob/int-tests-template/ddd/src/shared/test/clean.int-test.ts) (which I didn't commit) to have a more realistic number of test files and to increase the impact of database setup on the duration.

As the durations of the test are pretty consistent, I just paste one example per approach.

### 1. PGlite

```plaintext
 Test Files  25 passed (25)
      Tests  32 passed (32)
   Start at  11:56:23
   Duration  48.91s (setup 98%, tests 1%)
```

### 2. Global throwaway database

```plaintext
 Test Files  25 passed (25)
      Tests  32 passed (32)
   Start at  12:02:04
   Duration  12.47s (setup 83%, tests 11%, transform 4%, import 1%, worker 1%)
```

### 3. Throwaway database per test file

```plaintext
 Test Files  25 passed (25)
      Tests  32 passed (32)
   Start at  12:04:01
   Duration  8.85s (setup 76%, tests 20%, transform 2%, import 1%)
```

### 4. Throwaway database per test file created from template

```plaintext
 Test Files  25 passed (25)
      Tests  32 passed (32)
   Start at  12:06:06
   Duration  7.25s (setup 63%, tests 33%, transform 2%, import 1%, worker 1%)
```

## Conclusion

It turns out that creating one throwaway database per test file on a running PostgreSQL instance is the best solution. It is way faster than spinning up a PGlite database for each test file and also considerably faster than running test files sequentially on a single database.

It further turned out that creating the database from a template is indeed faster than pushing the schema each time.
