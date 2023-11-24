import { fluentWait, PollingConfiguration } from '../src/index';

async function fetchSomeData(): Promise<number | null> {
    return new Promise((resolve) => {
        console.log('Started async operation');
        setTimeout(() => {
            // For the sake of this example, let's return a random number or null
            resolve(Math.random() > 0.5 ? Math.random() : null);
        }, 1500);
    });
}

const pollingConfiguration: PollingConfiguration = {
    delayTime: 1000,
    timeout: 5000,
    pollingStartAfter: 0
};

console.log('Started fluentWait function sample');
fluentWait(
    fetchSomeData,
    (result) => result !== null,
    pollingConfiguration,
    () => console.log('Timeout!')
).then((result) => {
    if (result !== null) {
        console.log(`Fetched data: ${result}`);
    }
});
