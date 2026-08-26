import { runGeoSourceMonitoring } from '../engine/monitor.js'

async function main() {
  const args = process.argv.slice(2)
  console.log('=== MOONWITNESS GEO SOURCE MONITOR ===')
  console.log(`Executing monitor with arguments: ${args.join(' ') || '--all'}\n`)

  try {
    const report = await runGeoSourceMonitoring('kemendagri.wilayah')
    console.log(`Run ID: ${report.runId}`)
    console.log(`Source: ${report.sourceName}`)
    console.log(`Status: ${report.status}`)
    console.log(`Executed At: ${report.executedAt}`)
    console.log(`Candidates: Total=${report.diffSummary.total}, AutoSafe=${report.diffSummary.autoSafe}, ReviewRequired=${report.diffSummary.reviewRequired}, Blocked=${report.diffSummary.blocked}`)
    console.log(`Applied: ${report.appliedCount}`)
    if (report.details.length > 0) {
      console.log('\nDetails:')
      for (const d of report.details.slice(0, 10)) {
        console.log(`  - ${d}`)
      }
      if (report.details.length > 10) {
        console.log(`  ... and ${report.details.length - 10} more`)
      }
    }
  } catch (err) {
    console.error('Monitoring error:', err.message)
    process.exit(1)
  }
}

main()
