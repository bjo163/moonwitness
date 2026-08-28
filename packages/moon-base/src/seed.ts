import { getModel } from '@moon/orm'
import { loadBaseData } from './base-data.js'

export async function seedBaseData() {
  await loadBaseData()
}
