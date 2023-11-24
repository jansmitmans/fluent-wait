import { FluentWait } from '../src/index';

async function fetchSomeData(): Promise<number | null> {
    return new Promise((resolve) => {
        console.log('Started async operation');
        setTimeout(() => {
            // For the sake of this example, let's return a random number or null
            resolve(Math.random() > 0.5 ? Math.random() : null);
        }, 1500);
    });
}

console.log('Started fluentWait builder sample');
const demo = new FluentWait()
    .withFunctionToExecute(async () => {
        // This could be any asynchronous operation
        let result = await fetchSomeData();
        return result;
    })
    .toBeFulfilledCondition((result) => result !== null)
    .usePollingConfiguration({ delayTime: 1000, timeout: 5000 })
    .useTimeoutCallBack(() => console.log('Timeout!'))
    .execute();

demo.then((result) => {
    if (result !== null) {
        console.log(`Fetched data: ${result}`);
    }
});
