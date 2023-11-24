import { delay } from './utils/Delayer';

export type PollingConfiguration = { delayTime: number; timeout: number; pollingStartAfter?: number };
export type Condition<T> = (args?: any | T) => boolean;
export type ExecutionFunction<T> = (args?: any) => any | Promise<any> | Promise<T>;
export type TimeoutFunction<T> = (args?: any | T) => void;

const defaultPollingConfiguration: PollingConfiguration = {
    delayTime: 250,
    timeout: 10000,
    pollingStartAfter: 0
};

const defaultTimeoutCallback: TimeoutFunction<void> = () => {
    throw new Error('The condition was not satisfied within the timeout period.');
};

/* This functions runs another function until a condition is fulfilled. You can configure the time between delays and the timeout */
export async function fluentWait<T>(
    functionToExecute: ExecutionFunction<T>,
    condition: Condition<T>,
    pollingConfiguration: PollingConfiguration = defaultPollingConfiguration,
    timeoutCallback: TimeoutFunction<T> = defaultTimeoutCallback
): Promise<any> {
    let expiredTimeInMs = 0;
    const { delayTime, timeout, pollingStartAfter } = pollingConfiguration;

    let functionResult: any | T;
    while (!functionResult || (!condition(functionResult) && expiredTimeInMs < timeout)) {
        await delay(delayTime);
        expiredTimeInMs += delayTime;
        if (!pollingStartAfter || expiredTimeInMs >= pollingStartAfter) {
            functionResult = await functionToExecute();
        }
    }

    if (expiredTimeInMs >= timeout) {
        return timeoutCallback(functionResult);
    }
    return functionResult;
}

export class FluentWait<T> {
    private functionToExecute: ExecutionFunction<T>;
    private condition: Condition<T>;
    private pollingConfiguration: PollingConfiguration;
    private timeoutCallback: TimeoutFunction<T>;

    constructor() {}

    public withFunctionToExecute(functionToExecute: ExecutionFunction<T>): FluentWait<T> {
        this.functionToExecute = functionToExecute;
        return this;
    }

    public toBeFulfilledCondition(condition: Condition<T>): FluentWait<T> {
        this.condition = condition;
        return this;
    }

    public usePollingConfiguration(pollingConfiguration: PollingConfiguration): FluentWait<T> {
        this.pollingConfiguration = pollingConfiguration;
        return this;
    }

    public useTimeoutCallBack(timeoutCallback: TimeoutFunction<T>): FluentWait<T> {
        this.timeoutCallback = timeoutCallback;
        return this;
    }

    public async execute(): Promise<T> {
        if (!this.functionToExecute) {
            throw new Error('You must provide a function to execute.');
        }
        if (!this.condition) {
            throw new Error('You must provide a condition.');
        }
        return await fluentWait<T>(this.functionToExecute, this.condition, this.pollingConfiguration, this.timeoutCallback);
    }
}
