export function onchange(...fields: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.constructor._onchanges) {
      target.constructor._onchanges = {}
    }
    for (const field of fields) {
      if (!target.constructor._onchanges[field]) {
        target.constructor._onchanges[field] = []
      }
      target.constructor._onchanges[field].push(propertyKey)
    }
  }
}
