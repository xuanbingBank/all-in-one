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

export interface UTools {
    showMainWindow: () => void;
    hideMainWindow: () => void;
    outPlugin: () => void;
    onPluginEnter: (callback: (event: PluginEnterEvent) => void) => void;
    onPluginReady: (callback: () => void) => void;
}

declare global {
    interface Window {
        versions: ProcessVersions;
        utools: UTools;
        initialView: 'home' | 'settings';
    }
}
   