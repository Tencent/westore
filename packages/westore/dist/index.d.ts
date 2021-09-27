declare function diffData(current: any, previous: any): any;
declare function update(view: {
    data: any;
    _westorePrevData: any;
    setData: (arg0: any, arg1: any) => void;
}, callback?: any): any;
declare class Store {
    views: any;
    data: any;
    private _westoreViewId;
    constructor();
    bind(keyOrView: any, view: {
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
