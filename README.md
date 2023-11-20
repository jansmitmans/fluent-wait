# FluentWait Utility

This utility provides a fluent interface for creating a wait condition that periodically checks if a certain condition is met. It is useful when dealing with asynchronous operations where you need to wait for a certain condition to be fulfilled before proceeding.


Use 
- in async processes: wait until a batch job finishes until proceeding processing
- in e2e UI tests: wait until all expected locators are found
- ... many more cases.

## Usage

First, import the `FluentWait` class and the `PollingConfiguration` type from the module:

```typescript
import { FluentWait, PollingConfiguration } from './index';
```

Then, create a new instance of FluentWait:

```typescript
let fluentWait = new FluentWait();
```

You can then chain the following methods to configure the wait condition:

- `withFunctionToExecute(functionToExecute)`: This method sets the function that will be executed periodically. The function can be synchronous or asynchronous, and it can optionally take an argument.

- `toBeFulfilledCondition(condition)`: This method sets the condition that will be checked after each execution of the function. The condition should be a function that takes the result of the function to execute as an argument and returns a boolean.

- `usePollingConfiguration(pollingConfiguration)`: This method sets the polling configuration. The polling configuration should be an object of type PollingConfiguration that specifies the interval and timeout of the polling.

- `useTimeoutCallBack(timeoutCallback)`: This method sets a callback function that will be called if the wait condition times out.


Finally, call the execute method to start the wait condition:

```typescript
fluentWait.execute();
```

This will return a promise that resolves with the result of the function to execute when the condition is fulfilled, or rejects with an error if the wait condition times out.


## Example

```typescript
let fluentWait = await new FluentWait()
    .withFunctionToExecute(async () => {
        // This could be any asynchronous operation
        let result = await fetchSomeData();
        return result;
    })
    .toBeFulfilledCondition(result => result !== null)
    .usePollingConfiguration({ delayTime: 1000, timeout: 5000 })
    .useTimeoutCallBack(() => console.log('Timeout!'))
    .execute();
```

In this example, the fetchSomeData function is called every second until it returns a non-null result or until 5 seconds have passed. If the function still returns a null result after 5 seconds, the 'Timeout!' message is logged to the console. 

Another example will use the standalone method and the `.then()` handling for promises:

```typescript
import { fluentWait, PollingConfiguration } from './index';

async function fetchSomeData(): Promise<number | null> {
    // This could be any asynchronous operation
    // For the sake of this example, let's return a random number or null
    return Math.random() > 0.5 ? Math.random() : null;
}

const pollingConfiguration: PollingConfiguration = {
    delayTime: 1000,
    timeout: 5000,
    pollingStartAfter: 0
};

fluentWait(
    fetchSomeData,
    result => result !== null,
    pollingConfiguration,
    () => console.log('Timeout!')
).then(result => {
    if (result !== null) {
        console.log(`Fetched data: ${result}`);
    }
});
```