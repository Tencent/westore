declare function diffData(current: any, previous: any): any;
declare function update(view: any, callback?: any): void;
declare class Store {
    views: {};
    data: any;
    constructor();
    bind(key: any, view: any): void;
    update(viewKey: any): void;
}

declare const _default: {
    diffData: typeof diffData;
    update: typeof update;
    Store: typeof Store;
};

export { _default as default };
