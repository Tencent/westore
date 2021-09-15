interface Current {
	key?: any;
}

interface Previous {
	key?: any;
}

interface diffResult {
	key?: any;
}

export declare function diffData(current: Current, previous: Previous): diffResult;