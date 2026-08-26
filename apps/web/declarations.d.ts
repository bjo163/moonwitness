declare module "*.png" {
  const content:
    | {
        src: string
        height: number
        width: number
        blurDataURL?: string
      }
    | string
  export default content
}

declare module "*.jpg" {
  const content:
    | {
        src: string
        height: number
        width: number
        blurDataURL?: string
      }
    | string
  export default content
}

declare module "*.jpeg" {
  const content:
    | {
        src: string
        height: number
        width: number
        blurDataURL?: string
      }
    | string
  export default content
}

declare module "*.svg" {
  const content: any
  export default content
}

declare module "leaflet/dist/images/*.png" {
  const content: { src: string } | string
  export default content
}
