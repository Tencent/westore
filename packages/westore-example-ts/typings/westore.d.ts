declare module "westore" {
  export class Store<T> {
    data: T;
    bind: (key: string, view: any) => void;
    update: (viewKey?: string) => void;
  }

  export function update(view: any, callback?: () => void): void;
}
