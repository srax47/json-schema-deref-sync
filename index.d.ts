declare interface Options {
  baseFolder?: string
  cache?: boolean
  cacheTTL?: number
  failOnMissing?: boolean
  removeCircular?: boolean
  loader?: any //fn
}

declare function deref(schema: any, options?: Options): any

export = deref
