import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Operation = getModel('sg.operation')
  if (!Operation) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    operations?: { name: string; argument: string; wisdom: string; targetUrl: string }[]
  }>('shootgun')

  const operationSeeds = jsonSeed?.operations || [
    {
      name: 'Universal Celestial Alignment Analysis',
      argument: 'Analisis keteraturan orbit bulan dan matahari sebagai bukti nyata keesaan pencipta alam semesta dan hukum fisika deterministik.',
      wisdom: 'Matahari dan bulan beredar menurut perhitungan yang pasti (QS Ar-Rahman: 5).',
      targetUrl: 'https://moonwitness.org/astronomy/celestial-cycles'
    },
    {
      name: 'Prophetic Peace Protocol Benchmark',
      argument: 'Benchmarking prinsip-prinsip diplomasi kenabian dalam resolusi konflik antar-faksi dan penegakan keadilan sosial.',
      wisdom: 'Dan tidaklah Kami mengutus engkau (Muhammad) melainkan untuk menjadi rahmat bagi seluruh alam (QS Al-Anbiya: 107).',
      targetUrl: 'https://moonwitness.org/knowledge/prophetic-diplomacy'
    },
    {
      name: 'Epistemic Sanad Integrity Verification',
      argument: 'Audit verifikasi rantai transmisi teks klasik (isnad) terhadap distorsi naratif dan pemalsuan kutipan di era digital.',
      wisdom: 'Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (QS Al-Hujurat: 6).',
      targetUrl: 'https://moonwitness.org/knowledge/sanad-verification'
    },
    {
      name: 'Ecological Balance & Resource Stewardship',
      argument: 'Evaluasi kebijakan pengelolaan air, tanah, dan atmosfer berbasis prinsip Mizan dan larangan berbuat kerusakan di muka bumi.',
      wisdom: 'Dan janganlah kamu berbuat kerusakan di bumi setelah (diciptakan) dengan baik (QS Al-A\'raf: 56).',
      targetUrl: 'https://moonwitness.org/mizan/ecological-stewardship'
    },
    {
      name: 'Algorithmic Equity in Social Safety Nets',
      argument: 'Penerapan prinsip keadilan distributif pada sistem penyaluran jaminan sosial dan zakat berbasis pemodelan data berkeadilan.',
      wisdom: 'Supaya harta itu jangan hanya beredar di antara orang-orang kaya saja di antara kamu (QS Al-Hasyr: 7).',
      targetUrl: 'https://moonwitness.org/mizan/zakat-equity'
    }
  ]

  for (const op of operationSeeds) {
    const rows = await Operation.fetch(Operation, env, [['name', '=', op.name]])
    if (!rows.length) {
      await Operation.spawn(Operation, env, op)
    }
  }

  console.log(`[moon-shootgun] Demo data enriched: ${operationSeeds.length} comprehensive operations with wisdom and arguments`)
}
