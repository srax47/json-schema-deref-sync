import deref from '../'
import doc from './schemas/circularself.json'

const dereferencedSchema = deref(doc, {
  failOnMissing: true,
  removeCircular: true,
} as any)

console.log(dereferencedSchema)
