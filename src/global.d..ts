export {};

declare global {
    interface Window {
        electronAPI: {
            openTaskFile: () => Promise<any>; // I need to correct my interface for ImportedFile Type so for now this is temporarily accepting "any"
            saveTaskFile: (content: string) => Promise<void>;
            readFile: (filePath: string) => Promise<string>;
        }
    }
}