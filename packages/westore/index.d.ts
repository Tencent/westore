interface Current {
  key?: any;
}

interface Previous {
  key?: any;
}

interface diffResult {
  key?: any;
}

type WechatMiniprogramPageOrComponent = any;

interface Views {
  key?: WechatMiniprogramPageOrComponent;
}

export declare function diffData(
  current: Current,
  previous: Previous
): diffResult;

export declare function update(
  view: WechatMiniprogramPageOrComponent,
  callback?: () => void
): void;

export declare class Store {
  views: Views;
  data: any;
  constructor();
  bind(keyOrView: string | number | WechatMiniprogramPageOrComponent, view?: WechatMiniprogramPageOrComponent): void;
  update(viewKey?: string | number): void;
}

