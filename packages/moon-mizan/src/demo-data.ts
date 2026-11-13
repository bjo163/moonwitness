import { createCtx, getModel, SUPERUSER_ID, loadJsonSeed } from '@moon/orm'

export async function loadDemoData() {
  const Case = getModel('mz.case')
  const Assessment = getModel('mz.assessment')
  const Filter = getModel('mz.filter')
  const Reference = getModel('mz.reference')

  if (!Case || !Assessment || !Filter || !Reference) return

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  const jsonSeed = loadJsonSeed<{
    cases?: { title: string; caseText: string; subjectAlias: string; status: string; method: string; refCode: string; refSummary: string }[]
  }>('mizan')

  // ── 1. Cases ──
  const caseSeeds = jsonSeed?.cases || [
    {
      title: 'Ethical AI Data Governance in Knowledge Extraction',
      caseText: 'Penggunaan model kecerdasan buatan untuk ekstraksi otomatis relasi teks suci. Perlu dipastikan bahwa hasil ekstraksi tidak mendistorsi makna kontekstual wahyu dan tetap mempertahankan integritas sanad.',
      subjectAlias: 'AI-Extraction-Subsystem',
      status: 'assessed',
      method: 'prophetic',
      refCode: 'QS 4:58',
      refSummary: 'Perintah Allah untuk menyampaikan amanat kepada yang berhak dan menetapkan hukum secara adil.'
    },
    {
      title: 'Zakat Distribution Equity & Algorithmic Priority',
      caseText: 'Penentuan prioritas penyaluran zakat produktif menggunakan pembobotan kebutuhan dasar (asnaf) dengan mempertimbangkan kondisi geografis dan tingkat kerentanan ekonomi mustahik.',
      subjectAlias: 'Zakat-Equity-Engine',
      status: 'assessed',
      method: 'maqashid',
      refCode: 'QS 9:60',
      refSummary: 'Ketentuan delapan golongan asnaf yang berhak menerima zakat demi keadilan sosial.'
    },
    {
      title: 'Global Moon Sighting Synchronization vs Local Matla’',
      caseText: 'Penentuan kriteria unifikasi kalender hijriyah global dengan mempertimbangkan batasan astronomis imkanur rukyat dan tradisi keilmuan mazhab fikih klasik mengenai ikhtilaf al-mathali.',
      subjectAlias: 'Hilal-Matla-Unification',
      status: 'assessed',
      method: 'comparative',
      refCode: 'QS 2:189',
      refSummary: 'Pertanyaan mengenai bulan sabit dijawab sebagai penentu waktu ibadah dan haji.'
    },
    {
      title: 'Environmental Stewardship & Space Debris Mitigation',
      caseText: 'Tinjauan etis terhadap penumpukan sampah orbit luar angkasa dari satelit konstelasi komersial berisiko mengaburkan pengamatan langit malam dan merusak keseimbangan orbit bumi.',
      subjectAlias: 'Space-Debris-Stewardship',
      status: 'draft',
      method: 'mizan_balance',
      refCode: 'QS 55:7-9',
      refSummary: 'Penegakan neraca keseimbangan (al-mizan) dan larangan berbuat curang atau melampaui batas dalam neraca.'
    }
  ]

  for (const c of caseSeeds) {
    const caseRows = await Case.fetch(Case, env, [['title', '=', c.title]])
    let caseId: number
    if (!caseRows.length) {
      const cRow = await Case.spawn(Case, env, {
        title: c.title,
        caseText: c.caseText,
        subjectAlias: c.subjectAlias,
        status: c.status
      })
      caseId = cRow.id as number
    } else {
      caseId = caseRows[0].id as number
    }

    // Check if assessment already exists
    const assessRows = await Assessment.fetch(Assessment, env, [['caseId', '=', caseId]])
    if (!assessRows.length) {
      const aRow = await Assessment.spawn(Assessment, env, {
        caseId,
        method: c.method,
        powerRightScore: 8,
        powerLeftScore: 6,
        generalSufficient: true,
        balanceSatisfied: true,
        confidence: 'high',
        rightResult: `Prinsip keadilan, kemaslahatan dan integrasi maqashid pada ${c.subjectAlias} terpenuhi dengan pembobotan proporsional.`,
        leftResult: 'Terdapat kebutuhan kalibrasi parameter teknis secara berkala bersama dewan pakar.',
        action: 'Terapkan validasi ganda multi-disiplin ilmu syariah dan sains antariksa.',
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
          note: 'Terverifikasi sesuai kaidah syariah.'
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
        referenceCode: c.refCode,
        summary: c.refSummary,
        isRelevant: true,
        isVerified: true
      })

      // If case status was 'assessed', finalize it now that filters & reference exist
      if (c.status === 'assessed') {
        await Assessment.morph(Assessment, env, assessmentId, { isFinalized: true })
      }
    }
  }

  console.log(`[moon-mizan] Demo data enriched: ${caseSeeds.length} cases, assessments with filters and references`)
}
