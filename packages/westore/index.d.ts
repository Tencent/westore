interface Current {
	key?: any;
}

interface Previous {
	key?: any;
}

interface diffResult {
	key?: any;
}

type WechatMiniprogramPageOrComponent = any

export declare function diffData(current: Current, previous: Previous): diffResult;
export declare function update(view: WechatMiniprogramPageOrComponent, callback?: () => void): void;