import type { App } from 'vue'

export interface ProcessVersions {
    node: () => string;
    chrome: () => string;
    electron: () => string;
}

export interface PluginEnterEvent {
    code: string;
    type: string;
    payload: any;
}

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    language: 'zh_CN' | 'en_US';
    notifications: boolean;
    hotkey: string;
}

export interface UTools {
    showMainWindow: () => void;
    hideMainWindow: () => void;
    outPlugin: () => void;
    onPluginEnter: (callback: (event: PluginEnterEvent) => void) => void;
    onPluginReady: (callback: () => void) => void;
    showNotification: (text: string) => void;
    dbStorage: {
        setItem: (key: string, value: any) => void;
        getItem: (key: string) => any;
        removeItem: (key: string) => void;
    };
}

declare global {
    interface Window {
        versions: ProcessVersions;
        utools: UTools;
        initialView: 'home' | 'settings';
    }
}
   