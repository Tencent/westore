declare type WechatMiniprogramPageOrComponent = any;
interface Views {
    key?: WechatMiniprogramPageOrComponent;
}
interface Current {
    key?: any;
}
interface Previous {
    key?: any;
}
interface diffResult {
    key?: any;
}
declare function diffData(current: Current, previous: Previous): diffResult;
declare function update(view: WechatMiniprogramPageOrComponent, callback?: () => void): void;
declare class Store {
    views: Views;
    data: any;
    private _westoreViewId;
    constructor();
    bind(keyOrView: string | number | WechatMiniprogramPageOrComponent, view?: WechatMiniprogramPageOrComponent): void;
    update(viewKey: string | number): void;
}

declare const _default: {
    diffData: typeof diffData;
    update: typeof update;
    Store: typeof Store;
};

export { _default as default };
