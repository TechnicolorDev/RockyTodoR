declare module NodeJS {
    interface Require {
        context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): {
            keys: () => string[];
            <T>(id: string): T;
        };
    }
}
