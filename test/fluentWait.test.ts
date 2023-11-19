import { fluentWait, FluentWait, PollingConfiguration } from '../src/index';

describe('fluentWait function', () => {

    const pollingConfiguration: PollingConfiguration = {
        customDelayTimeInMs: 100,
        pollingTimeoutInMs: 1000,
    };

    it('should execute the given function until the condition is fulfilled', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(true);

        const result = await fluentWait(functionToExecute, condition);

        expect(functionToExecute).toHaveBeenCalled();
        expect(condition).toHaveBeenCalled();
        expect(result).toBe('test');
    });

    it('should throw an error if the condition is not satisfied within the timeout period', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(false);

        await expect(fluentWait(functionToExecute, condition, pollingConfiguration)).rejects.toThrow('The condition was not satisfied within the timeout period.');
    });

    it('should call the timeout callback if provided and the condition is not satisfied within the timeout period', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(false);
        const timeoutCallback = jest.fn().mockReturnValue('timeout');

        const result = await fluentWait(functionToExecute, condition, pollingConfiguration, timeoutCallback);

        expect(timeoutCallback).toHaveBeenCalled();
        expect(result).toBe('timeout');
    });

    it('should respect the polling configuration', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(true);
        const pollingConfiguration: PollingConfiguration = {
            customDelayTimeInMs: 1000,
            pollingTimeoutInMs: 5000,
            pollingStartAfterInMs: 2000
        };

        const result = await fluentWait(functionToExecute, condition, pollingConfiguration);

        expect(functionToExecute).toHaveBeenCalled();
        expect(condition).toHaveBeenCalled();
        expect(result).toBe('test');
    });
});

describe('FluentWait class', () => {
    const pollingConfiguration: PollingConfiguration = {
        customDelayTimeInMs: 100,
        pollingTimeoutInMs: 1000,
    };

    it('should execute the given function until the condition is fulfilled', async () => {
        const functionToExecute = jest.fn().mockResolvedValue({ key: 'test' });
        const condition = jest.fn().mockReturnValue(true);

        const result = await new FluentWait<{key: string}>()
            .withFunctionToExecute(functionToExecute)
            .toBeFulfilledCondition(condition)
            .execute();

        expect(functionToExecute).toHaveBeenCalled();
        expect(condition).toHaveBeenCalled();
        expect(result).toEqual({ key: 'test' });
    });

    it('should throw an error if the function to execute is not provided', async () => {
        const condition = jest.fn().mockReturnValue(true);

        await expect(new FluentWait()
            .toBeFulfilledCondition(condition)
            .execute()).rejects.toThrow('You must provide a function to execute.');
    });

    it('should throw an error if the condition is not provided', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');

        await expect(new FluentWait()
            .withFunctionToExecute(functionToExecute)
            .execute()).rejects.toThrow('You must provide a condition.');
    });

    it('should throw an error if the condition is not satisfied within the timeout period', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(false);

        await expect(new FluentWait()
            .withFunctionToExecute(functionToExecute)
            .toBeFulfilledCondition(condition)
            .usePollingConfiguration(pollingConfiguration)
            .execute()).rejects.toThrow('The condition was not satisfied within the timeout period.');
    });

    it('should call the timeout callback if provided and the condition is not satisfied within the timeout period', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(false);
        const timeoutCallback = jest.fn().mockReturnValue('timeout');

        const result = await new FluentWait()
            .withFunctionToExecute(functionToExecute)
            .toBeFulfilledCondition(condition)
            .usePollingConfiguration(pollingConfiguration)
            .useTimeoutCallBack(timeoutCallback)
            .execute();

        expect(timeoutCallback).toHaveBeenCalled();
        expect(result).toBe('timeout');
    });

    it('should respect the polling configuration', async () => {
        const functionToExecute = jest.fn().mockResolvedValue('test');
        const condition = jest.fn().mockReturnValue(true);
        const pollingConfiguration: PollingConfiguration = {
            customDelayTimeInMs: 1000,
            pollingTimeoutInMs: 5000,
            pollingStartAfterInMs: 2000
        };

        const result = await new FluentWait()
            .withFunctionToExecute(functionToExecute)
            .toBeFulfilledCondition(condition)
            .usePollingConfiguration(pollingConfiguration)
            .execute();

        expect(functionToExecute).toHaveBeenCalled();
        expect(condition).toHaveBeenCalled();
        expect(result).toBe('test');
    });
});
