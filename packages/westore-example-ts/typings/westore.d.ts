declare module "westore" {
  export class Store<T> {
    data: T;
    bind: (key: string, view: any) => void;
    update: (viewKey?: string) => void;
  }
}
