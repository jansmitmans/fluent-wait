export async function delay(delayTimeMillis: number): Promise<void> {
    return new Promise<void>((resolve) =>
        setTimeout(() => {
            resolve();
        }, delayTimeMillis)
    );
}
