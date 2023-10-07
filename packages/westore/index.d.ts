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

export declare class Store<T> {
  views: Views;
  data: T;
  constructor();
  bind(keyOrView: string | number | WechatMiniprogramPageOrComponent, view?: WechatMiniprogramPageOrComponent): void;
  unbind(view: WechatMiniprogramPageOrComponent): void;
  update(viewKey?: string | number,callback?: () => void): void;
}

