export let defaultDelay: number = 250;
export let defaultTimeout: number = 10000;
export let defaultPollingStartAfter = 0;

export function setDefaultValues(delayTimeInMs?: number, pollingTimeoutInMs?: number, pollingStartAfterInMs?: number): void {
    if (delayTimeInMs !== undefined) {
        defaultDelay = delayTimeInMs;
    }
    if (pollingTimeoutInMs !== undefined) {
        defaultTimeout = pollingTimeoutInMs;
    }
    if (pollingStartAfterInMs !== undefined) {
        defaultPollingStartAfter = pollingStartAfterInMs;
    }
}

export type PollingConfiguration = { delayTime: number; timeout: number; pollingStartAfter?: number };

async function delay(delayTimeMillis: number): Promise<void> {
    return new Promise<void>((resolve) =>
        setTimeout(() => {
            resolve();
        }, delayTimeMillis)
    );
}

/* This functions runs another function until a condition is fulfilled. You can configure the time between delays and the timeout */
export async function fluentWait<T>(
    functionToExecute: (args?: any) => any | Promise<any> | Promise<T>,
    condition: (args?: any | T) => boolean,
    pollingConfiguration?: PollingConfiguration,
    timeoutCallback?: (args?: any | T) => void
): Promise<any> {
    let expiredTimeInMs = 0;
    const delayTimeInMs = pollingConfiguration?.delayTime ?? defaultDelay;
    const pollingTimeoutInMs = pollingConfiguration?.timeout ?? defaultTimeout;
    const pollingStartAfterInMs = pollingConfiguration?.pollingStartAfter ?? defaultPollingStartAfter;

    let functionResult: any | T;
    while (!functionResult || (!condition(functionResult) && expiredTimeInMs < pollingTimeoutInMs)) {
        await delay(delayTimeInMs);
        expiredTimeInMs += delayTimeInMs;
        if (expiredTimeInMs >= pollingStartAfterInMs) {
            functionResult = await functionToExecute();
        }
    }

    if (expiredTimeInMs >= pollingTimeoutInMs) {
        if (timeoutCallback) {
            return timeoutCallback(functionResult);
        }
        throw new Error('The condition was not satisfied within the timeout period.');
    }
    return functionResult;
}

export class FluentWait<T> {
    private functionToExecute?: (args?: any) => any | Promise<any> | Promise<T>;
    private condition?: (args?: any | T) => boolean;
    private pollingConfiguration?: PollingConfiguration;
    private timeoutCallback?: (args?: any | T) => void;

    constructor() {
        this.functionToExecute = undefined;
        this.condition = undefined;
        this.pollingConfiguration = undefined;
        this.timeoutCallback = undefined;
    }

    public withFunctionToExecute(functionToExecute: (args?: any) => any | Promise<any> | Promise<T>): FluentWait<T> {
        this.functionToExecute = functionToExecute;
        return this;
    }

    public toBeFulfilledCondition(condition: (args?: any | T) => boolean): FluentWait<T> {
        this.condition = condition;
        return this;
    }

    public usePollingConfiguration(pollingConfiguration: PollingConfiguration): FluentWait<T> {
        this.pollingConfiguration = pollingConfiguration;
        return this;
    }

    public useTimeoutCallBack(timeoutCallback: (args?: any | T) => void): FluentWait<T> {
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
