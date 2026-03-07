export const log = (message: string, source = "server") => {
    const time = new Date().toISOString();

    console.log(`[${time}] [${source}] ${message}`);
};