export {};

declare global {
    interface Window {
        electronAPI: {
            openTaskFile: () => Promise<string>;
            saveTaskFile: (content: string) => Promise<void>;
        }
    }
}