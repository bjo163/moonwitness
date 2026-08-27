import { createCtx, getModel, SUPERUSER_ID } from '@moon/orm'

export async function loadDemoData() {
  const Case = getModel('mz.case')
  const Assessment = getModel('mz.assessment')
  const Filter = getModel('mz.filter')
  const Reference = getModel('mz.reference')

  if (!Case || !Assessment || !Filter || !Reference) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  // ── 1. Cases ──
  const caseSeeds = [
    {
      title: 'Ethical AI Data Governance in Knowledge Extraction',
      caseText: 'Penggunaan model kecerdasan buatan untuk ekstraksi otomatis relasi teks suci. Perlu dipastikan bahwa hasil ekstraksi tidak mendistorsi makna kontekstual wahyu dan tetap mempertahankan integritas sanad.',
      subjectAlias: 'AI-Extraction-Subsystem',
      status: 'assessed'
    },
    {
      title: 'Zakat Distribution Equity & Algorithmic Priority',
      caseText: 'Penentuan prioritas penyaluran zakat produktif menggunakan pembobotan kebutuhan dasar (asnaf) dengan mempertimbangkan kondisi geografis dan tingkat kerentanan ekonomi mustahik.',
      subjectAlias: 'Zakat-Equity-Engine',
      status: 'draft'
    }
  ]

  for (const c of caseSeeds) {
    const caseRows = await Case.fetch(Case, env, [['title', '=', c.title]])
    let caseId: number
    if (!caseRows.length) {
      const cRow = await Case.spawn(Case, env, c)
      caseId = cRow.id as number
    } else {
      caseId = caseRows[0].id as number
    }

    // Check if assessment already exists
    const assessRows = await Assessment.fetch(Assessment, env, [['caseId', '=', caseId]])
    if (!assessRows.length) {
      const aRow = await Assessment.spawn(Assessment, env, {
        caseId,
        method: 'prophetic',
        powerRightScore: 8,
        powerLeftScore: 6,
        generalSufficient: true,
        balanceSatisfied: true,
        confidence: 'high',
        rightResult: 'Prinsip keadilan data dan integritas teks suci terpenuhi.',
        leftResult: 'Terdapat batasan teknis pada variasi dialek teks klasik.',
        action: 'Terapkan validasi ganda oleh tim pentashih sebelum data dipublikasikan.',
        isFinalized: false
      })
      const assessmentId = aRow.id as number

      // Primary filters
      const primaryFilterLabels = [
        'Kesesuaian dengan Maqashid Syariah',
        'Bebas dari Kerusakan (Dharar)',
        'Keadilan Proporsional',
        'Kemaslahatan Umum (Maslahah Mursalah)'
      ]
      for (let p = 1; p <= 4; p++) {
        await Filter.spawn(Filter, env, {
          assessmentId,
          stage: 'primary',
          position: p,
          label: primaryFilterLabels[p - 1],
          answer: 'yes',
          note: 'Terverifikasi sesuai kaidah.'
        })
      }

      // Secondary filters
      const secondaryFilterLabels = [
        'Kejelasan Akuntabilitas Keputusan',
        'Transparansi Metodologi Pembobotan',
        'Perlindungan Hak Pihak Terdampak',
        'Kesesuaian Realitas Implementasi'
      ]
      for (let s = 1; s <= 4; s++) {
        await Filter.spawn(Filter, env, {
          assessmentId,
          stage: 'secondary',
          position: s,
          label: secondaryFilterLabels[s - 1],
          answer: 'yes',
          note: 'Parameter operasional telah ditinjau.'
        })
      }

      // Reference
      await Reference.spawn(Reference, env, {
        assessmentId,
        source: 'quran',
        referenceCode: 'QS 4:58',
        summary: 'Perintah Allah untuk menyampaikan amanat kepada yang berhak dan menetapkan hukum secara adil.',
        isRelevant: true,
        isVerified: true
      })
    }
  }

  console.log('[moon-mizan] Demo data loaded: 2 cases, 2 assessments with filters and references')
}
