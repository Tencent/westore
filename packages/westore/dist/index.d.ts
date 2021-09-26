declare function diffData(current: any, previous: any): any;
declare function update(view: {
    data: any;
    _westorePrevData: any;
    setData: (arg0: any, arg1: any) => void;
}, callback?: any): void;
declare class Store {
    views: any;
    data: any;
    constructor();
    bind(key: string | number, view: {
        data: any;
    }): void;
    update(viewKey: string | number): void;
}

declare const _default: {
    diffData: typeof diffData;
    update: typeof update;
    Store: typeof Store;
};

export { _default as default };
