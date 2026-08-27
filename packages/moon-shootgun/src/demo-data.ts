import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Operation = getModel('sg.operation')
  if (!Operation) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const operationSeeds = [
    {
      name: 'Universal Celestial Alignment Analysis',
      argument: 'Analisis keteraturan orbit bulan dan matahari sebagai bukti nyata keesaan pencipta alam semesta.',
      wisdom: 'Matahari dan bulan beredar menurut perhitungan yang pasti (QS Ar-Rahman: 5).'
    },
    {
      name: 'Prophetic Peace Protocol Benchmark',
      argument: 'Benchmarking prinsip-prinsip diplomasi kenabian dalam menjaga stabilitas sosial dan kemanusiaan.',
      wisdom: 'Dan tidaklah Kami mengutus engkau (Muhammad) melainkan untuk menjadi rahmat bagi seluruh alam (QS Al-Anbiya: 107).'
    }
  ]

  for (const op of operationSeeds) {
    const rows = await Operation.fetch(Operation, env, [['name', '=', op.name]])
    if (!rows.length) {
      await Operation.spawn(Operation, env, op)
    }
  }

  console.log('[moon-shootgun] Demo data loaded: 2 operations')
}
