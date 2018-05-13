---
layout: default
cta: newsletter
title: About Me
permalink: /about/
---

# E2E suite separation ideas

Each suite should create the user and org before all sub-tests are ran.
So, **two suites wil not run on the same user or organization**.

```typescript
describe('customer support tests', () => {

  describe('create ticket', () => {
    let org;
    let user;

    beforeAll((done) => {
      createCustomerSupportEntities()
        .then((entities) => {
          org = entities.org;
          user = entities.user
        })
        .then(() => done())
        .catch((err) => done.fail(err));
    });
    
    // ...
    
   });
   
   describe('modify ticket', () => {
    let org;
    let user;
    let supportTicket;

    beforeAll((done) => {
      createCustomerSupportEntities()
        .then((entities) => {
          org = entities.org;
          user = entities.user
        })
        .then(() => createSupportTicket())
        .then((ticket) => supportTicket = ticket)
        .then(() => done())
        .catch((err) => done.fail(err));
    });
    
    // ...
    
   });

});
```

We can also combine the user and org creation into the upper suite. But we need to make sure this won't make another link between the suites.

```typescript
describe('customer support tests', () => {
  let org;
  let user;

  beforeAll((done) => {
    createCustomerSupportEntities()
      .then((entities) => {
        org = entities.org;
        user = entities.user
      })
      .then(() => done())
      .catch((err) => done.fail(err));
  });

  describe('create ticket', () => {
    // no need for something new here
    // ...
    
   });
   
   describe('modify ticket', () => {
    let supportTicket;

    beforeAll((done) => {
      createSupportTicket()
        .then((ticket) => supportTicket = ticket)
        .then(() => done())
        .catch((err) => done.fail(err));
    });
    
    // ...
    
   });

});
```

## Combining Strategies

Another strategy of doing things is using the upper suite user and organization, unless they don't exist. It's a combintation of the two previous strategy:

```typescript
describe('customer support tests', () => {
  let org;
  let user;

  beforeAll((done) => {
    createCustomerSupportEntities()
      .then((entities) => {
        org = entities.org;
        user = entities.user;
      })
      .then(() => done())
      .catch((err) => done.fail(err));
  });

  describe('create ticket', () => {
    beforeAll(() => {
      Promise.resolve()
        .then(() => {
        // don't create if exists already
        if (user) return;

        return createCustomerSupportEntities()
          .then((entities) => {
            org = entities.org;
            user = entities.user;
          });
        })
        .then(() => createSupportTicket())
        .then((ticket) => supportTicket = ticket)
        .then(() => done())
        .catch((err) => done.fail(err));
    })

    // ...
    
   });
   
   describe('modify ticket', () => {
    let supportTicket;

    beforeAll((done) => {
      createSupportTicket()
        .then((ticket) => supportTicket = ticket)
        .then(() => done())
        .catch((err) => done.fail(err));
    });
    
    // ...
    
   });

});
```

## Basic Concepts

I would separate this task into several sub-tasks:

1. Create a request data randomizer using `chance.js` to generate random data instead of specific data
2. Create a class (or several) to handle api request calls that use an http promise based syntax to match the tests themselves.
3. Each main part of the site (`billing`, `customer-support`, `am`, etc.) should have a `FO`(Flow Object - WIP), just like our `POs`, that will chain some basic functions from [2] and combine them into specific flows.

   for example, customer-support `FO` can include a function that **Creates an Organization and a user with customer support role**.

## Extra Thoughts

1. Instead of using the `beforeAll` function, we might call the promise based flow as the first test. This will allow us to also notify on failure in preparations for a suite

## Check for IT problems to `warn` a user

If we get a good enough indication from the server on what happened, we can stop a `describe` test suite if an error originated from IT.

1. Instead of using the `beforeAll` function, we might call the promise based flow as the first test.
      This will allow us to also notify on failure in preparations for a suite.
      This can be done by creating a custome reporter or using an already existing one (like [this one](https://www.npmjs.com/package/protractor-stop-describe-on-failure) or [this one](https://www.npmjs.com/package/jasmine-disable-remaining)).

      One of them allows us to stop the rest of the tests by setting a configuration inside a test of in the `beforeAll` or `afterAll`:

      > ### Dynamic
      >
      > You can also specify dynamically (within you tests) when to disable all remaining specs.
      >
      > ##### Disable all remaining specs
      <!-- > ```javascript
      > const config = browser.params.jasmineDisableRemainingReporter.jasmineDisableRemaining.config;
      > config.allSpecsDynamic.disableSpecs = true;
      > ``` -->
      > Use this if you want to disable all tests after the first fail. It must be set before the spec you're interested in.
      > <div class="kb-source"><a href="https://www.npmjs.com/package/jasmine-disable-remaining" target="_blank">https://www.npmjs.com/package/jasmine-disable-remaining</a></div>