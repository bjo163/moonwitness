import 'dotenv/config'
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import performanceAddons from '@moon/performance'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'
import { trackRequest, trackQuery, trackSystem } from '@moon/performance'

async function test() {
  // Initialize server with both addons
  const server = new NativeServer({
    database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
    jwtSecret: 'secret',
    addons: [...baseAddons.models, ...performanceAddons.models]
  })

  console.log('\n🧪 Testing Performance Addon Integration...\n')

  try {
    // Test 1: Track HTTP Request
    console.log('📊 Test 1: Track HTTP Request')
    await trackRequest({
      method: 'GET',
      path: '/api/external/weather',
      latencyMs: 245.5,
      statusCode: 200,
      cacheStatus: 'HIT',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Test'
    })
    console.log('   ✅ Request tracked successfully\n')

    // Test 2: Track Query Performance
    console.log('📊 Test 2: Track Database Query')
    await trackQuery({
      model: 'vx.user',
      operation: 'SELECT',
      executionMs: 12.3,
      recordCount: 5,
      hadError: false
    })
    console.log('   ✅ Query tracked successfully\n')

    // Test 3: Track System Metrics
    console.log('📊 Test 3: Track System Metrics')
    const memUsage = process.memoryUsage()
    await trackSystem({
      memoryUsedMb: memUsage.heapUsed / 1024 / 1024,
      memoryTotalMb: memUsage.heapTotal / 1024 / 1024,
      uptimeSeconds: Math.floor(process.uptime()),
      activeConnections: 5
    })
    console.log('   ✅ System metrics tracked successfully\n')

    // Test 4: Verify records created
    console.log('📊 Test 4: Verify Records in Database')
    const env = createCtx(SUPERUSER_ID, {}, getModel as any)

    const PxRequest = getModel('px.request')
    const requests = await PxRequest.scan(PxRequest as any, env, [], { limit: 5 })
    console.log(`   ✅ Found ${requests.length} request records`)

    const PxQuery = getModel('px.query')
    const queries = await PxQuery.scan(PxQuery as any, env, [], { limit: 5 })
    console.log(`   ✅ Found ${queries.length} query records`)

    const PxSystem = getModel('px.system')
    const systems = await PxSystem.scan(PxSystem as any, env, [], { limit: 5 })
    console.log(`   ✅ Found ${systems.length} system records\n`)

    // Test 5: Check slow query detection
    console.log('📊 Test 5: Test Slow Query Detection')
    await trackQuery({
      model: 'vx.user',
      operation: 'SELECT',
      executionMs: 150.5, // >100ms = slow
      recordCount: 1000,
      hadError: false
    })
    
    const slowQueries = await PxQuery.scan(PxQuery as any, env, [['isSlow', '=', true]], { limit: 5 })
    console.log(`   ✅ Found ${slowQueries.length} slow query records\n`)

    console.log('✅ All tests passed!\n')

  } catch (err) {
    console.error('❌ Test failed:', err)
    process.exit(1)
  }

  process.exit(0)
}

test().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
