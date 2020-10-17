---
title: How to Restart a Spring Application Context within a JUnit test
summary: The Problem When attempting to write some failover tests to verify the resilience features in Eventeum, there didnt seem to be an easy way to restart a Spring application in the middle of an integration test. Spring provides the @DirtiesContext annotation in order to rebuild the context before or after a test run, but this is not of much use for service failure testing unless you write a suite of tests that depend on each other, which is generally regarded as a bad practice. The Solution After d
authors:
  - Craig Williams (@craig)
date: 2019-09-20
some_url: 
---

# How to Restart a Spring Application Context within a JUnit test

## The Problem
When attempting to write some failover tests to verify the resilience features in [Eventeum](https://github.com/ConsenSys/eventeum), there didn't seem to be an easy way to restart a Spring application in the middle of an integration test.  Spring provides the `@DirtiesContext` annotation in order to rebuild the context before or after a test run, but this is not of much use for service failure testing unless you write a suite of tests that depend on each other, which is generally regarded as a bad practice.

## The Solution
After doing a deep-dive into how the `SpringRunner` works behind the scenes, I managed to come up with a solution that enabled me to programmatically restart a service within a JUnit 4 test.

### SpringRestarter singleton

A 'SpringRestarter' singleton class is defined which is the entry point used to restart the Spring application context within a test method.

```java
public class SpringRestarter {

    private static SpringRestarter INSTANCE = null;

    private TestContextManager testContextManager;

    public static SpringRestarter getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new SpringRestarter();
        }

        return INSTANCE;
    }

    public void init(TestContextManager testContextManager) {
        this.testContextManager = testContextManager;
    }

    public void restart(Runnable stoppedLogic) {
        testContextManager.getTestContext().markApplicationContextDirty(DirtiesContext.HierarchyMode.EXHAUSTIVE);

        if (stoppedLogic != null) {
            stoppedLogic.run();
        }

        testContextManager.getTestContext().getApplicationContext();
        reinjectDependencies();
    }

    private void reinjectDependencies()  {
        testContextManager
                .getTestExecutionListeners()
                .stream()
                .filter(listener -> listener instanceof DependencyInjectionTestExecutionListener)
                .findFirst()
                .ifPresent(listener -> {
                    try {
                        listener.prepareTestInstance(testContextManager.getTestContext());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
    }
}
```

#### init(..)
The SpringRestarter needs to be initialised with a `TestContextManager` object.  The `TestContext` contains the application context restart code which is used by the `@DirtiesContext` annotation, which we will also be using in our implementation.

#### restart(..)
This is the method called by tests that wish to restart the application context.  It delegates stopping the context to the `testContext.markApplicationContextDirty(..)` method, and subsequently restarts the context by calling `getTestContext().getApplicationContext()`.  There is also an optional `stoppedLogic` method argument which can contain any logic that should be run after the context has been stopped, before it is restarted again.

The `reinjectDependencies()` method is then called...

#### reinjectDependencies()
As spring dependencies can be autowired into a test class, we need to reinject these dependencies after restarting.  This method is slightly hacky, but rather then duplicating the code within the `DependencyInjectionTestExecutionListener` `prepareTestInstance` method, we iterate through all the configured test listeners until we find the correct listener and call `prepareTestInstance(..)` on that listener.  This will then reinject any autowired Spring beans into your test.

### Extending SpringJUnit4ClassRunner

We need to initialise the `SpringRestarter` singleton with a `TestContextManager` and this class is where this object is created, so it also makes sense to `init` the singleton here.

```java
public class RestartingSpringJUnit4ClassRunner extends SpringJUnit4ClassRunner {

    public RestartingSpringJUnit4ClassRunner(Class<?> clazz) throws InitializationError {
        super(clazz);
    }

    @Override
    protected Object createTest() throws Exception {
        final Object testInstance = super.createTest();

        SpringRestarter.getInstance().init(getTestContextManager());

        return testInstance;
    }
}
```

We override the `createTest(..)` method (called to initialise the test class); after invoking the super class method to create the test instance, the `SpringRestarter` is initialised with the `TestContextManager`.

### Extending SpringRunner

`SpringRunner` extends `SpringJUnit4ClassRunner`, and as we have now created a new extended version of this class, we also need to extend the `SpringRunner` class.

```java
public class RestartingSpringRunner extends RestartingSpringJUnit4ClassRunner {

    public RestartingSpringRunner(Class<?> clazz) throws InitializationError {
        super(clazz);
    }
}
```

### Using Within a JUnit 4 Test
Once these building blocks are in place, its really quite simple to restart the Spring application context within your integration tests.

```java
@RunWith(RestartingSpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MyIntegrationTests {

    public void myRestartingTest() {
        //Some test logic before the context restart
        
        SpringRestarter.getInstance().restart(() -> {/* Some logic after context stopped */});
        
        //Some test logic after the context restart
    }
}
```

Simply run with the new `RestartingSpringBootRunner`, and force a context restart by calling `restart` on the `SpringRestarter` singleton...thats it!!

## Summary
Having the ability to restart a Spring application context during an integration test is a very desirable feature, especially when testing the recovery behaviour of your application after it has rebooted.

This feature can be implemented by making a few trivial extensions to a couple of Spring test classes along with implementing a relatively simple restarter singleton.  It is then very easy to integrate within your JUnit tests. 



