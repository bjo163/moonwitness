export interface ApiAddonModel {
  name: string
  description: string
  recName: string
  defaultView: string
  icon: string
  accentColor: string
}

export interface ApiAddonManifest {
  id: string
  name: string
  packageName: string
  description: string
  depends: string[]
  primaryModel: string
  modelCount: number
  models: ApiAddonModel[]
  category?: string
}
