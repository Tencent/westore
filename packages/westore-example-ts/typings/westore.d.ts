declare module 'westore' {
  export class Store {
    bind: (key: string, view: any) => void
    update: (viewKey: string) => void
  }
}
