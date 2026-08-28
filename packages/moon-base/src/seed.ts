import { getModel } from '@moon/orm'
import { loadBaseData } from './base-data.ts'

export async function seedBaseData() {
  await loadBaseData()
}
