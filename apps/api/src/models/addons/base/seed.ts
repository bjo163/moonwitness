import { getModel } from '../../registry.js'
import { loadBaseData } from './base-data.js'

export async function seedBaseData() {
  await loadBaseData()
}
