# @moon/performance - Roadmap

## ✅ Phase 1: Core Models & Tracking (COMPLETED)

- [x] **PxRequest** - HTTP request performance tracking
  - Method, path, latency, status code, cache status
  - User agent, IP address tracking
  - Request/response size metrics
  
- [x] **PxQuery** - Database query performance
  - Model, operation type tracking
  - Execution time measurement
  - Slow query detection (>100ms)
  - Error tracking
  
- [x] **PxCache** - Cache statistics aggregation
  - Hit/miss/stale counters
  - Average latency calculation
  - Time window tracking
  
- [x] **PxSystem** - System resource metrics
  - Memory usage (heap)
  - CPU usage, event loop lag
  - Connection pool stats
  - Process uptime

- [x] **Tracker Utilities**
  - `trackRequest()` - Log HTTP requests
  - `trackQuery()` - Log database queries
  - `trackSystem()` - Log system metrics
  - `updateCacheStats()` - Update cache aggregates

- [x] **Integration**
  - Package structure matching moon-base
  - Export models and utilities
  - Integration with apps/api
  - Test suite validation

---

## 🚧 Phase 2: Aggregation & Analytics (PLANNED)

### Aggregation Queries

- [ ] **PxRequestAgg** - Aggregated request statistics
  - Group by endpoint, hour, day
  - P50, P95, P99 latency percentiles
  - Request count, error rate
  
- [ ] **PxQueryAgg** - Aggregated query statistics
  - Group by model, operation
  - Identify most expensive queries
  - Track query frequency

### Analytics Functions

```typescript
// Hourly aggregation
await aggregateHourly('px.request', startDate, endDate)

// Calculate percentiles
const p95 = await calculatePercentile('px.request', 'latencyMs', 0.95)

// Get trending slow queries
const trending = await getTrendingSlowQueries(limit)
```

---

## 🎯 Phase 3: Alerting & Monitoring (PLANNED)

### Alert System

- [ ] **PxAlert** - Alert configuration model
  - Threshold-based alerts
  - Rate-based alerts (requests/sec)
  - Anomaly detection

- [ ] **PxAlertHistory** - Alert firing history

### Alert Types

```typescript
// CPU usage alert
await createAlert({
  metric: 'cpu_usage',
  threshold: 80,
  duration: 300, // 5 minutes
  action: 'email'
})

// Slow endpoint alert
await createAlert({
  metric: 'endpoint_latency',
  path: '/api/critical',
  threshold: 1000, // 1 second
  action: 'webhook'
})
```

---

## 📊 Phase 4: Dashboard Integration (PLANNED)

### Widget Components

- [ ] **PerformanceOverview** - Real-time metrics
- [ ] **SlowQueriesWidget** - Top slow queries
- [ ] **CacheHitRateChart** - Cache efficiency over time
- [ ] **SystemResourceChart** - Memory/CPU trends
- [ ] **EndpointLatencyHeatmap** - Request latency visualization

### REST Endpoints

```typescript
GET /api/performance/overview
GET /api/performance/slow-queries?limit=10
GET /api/performance/cache-stats
GET /api/performance/system-trends?period=24h
```

---

## 🔌 Phase 5: External Integrations (PLANNED)

### Export Adapters

- [ ] **Prometheus Exporter**
  ```typescript
  GET /metrics  // Prometheus format
  ```

- [ ] **Grafana Integration**
  - Pre-built dashboards
  - JSON export/import

- [ ] **DataDog Integration**
  - Metric forwarding
  - APM traces

- [ ] **CloudWatch Integration**
  - AWS CloudWatch metrics

---

## 🧪 Phase 6: Advanced Features (FUTURE)

### Distributed Tracing

- [ ] **PxTrace** - Distributed trace model
  - Trace ID, span ID
  - Parent-child relationships
  - Service-to-service calls

```typescript
const trace = await startTrace('user-login')
const span = await trace.startSpan('database-query')
// ... operation ...
await span.end()
await trace.end()
```

### Performance Regression Detection

- [ ] Automatic baseline calculation
- [ ] Statistical anomaly detection
- [ ] Regression notifications

```typescript
// Detect performance regression
const regression = await detectRegression('px.request', {
  metric: 'latencyMs',
  path: '/api/users',
  baselineDays: 7,
  threshold: 1.5 // 50% increase
})
```

### Profiling Integration

- [ ] CPU profiling triggers
- [ ] Memory leak detection
- [ ] Heap snapshot automation

### Load Testing Integration

- [ ] Performance benchmark storage
- [ ] Load test result comparison
- [ ] Automated regression testing

---

## 🛠️ Technical Improvements

### Performance Optimizations

- [ ] Batch insert for high-volume tracking
- [ ] Sampling strategies (track 1 in N requests)
- [ ] Async background writing with queue
- [ ] Partitioned tables for time-series data

```typescript
// Sampling configuration
trackRequest({
  ...metrics,
  sample: 0.1 // Track 10% of requests
})
```

### Data Retention Policies

- [ ] Automatic data pruning
- [ ] Configurable retention periods
- [ ] Archive to cold storage

```typescript
// Configure retention
await setRetentionPolicy('px.request', {
  keepDays: 30,
  archiveDays: 90
})
```

### Query Optimization

- [ ] Automatic index creation
- [ ] Materialized views for aggregates
- [ ] Query plan analysis

---

## 📝 Documentation Improvements

- [ ] API reference documentation
- [ ] Performance tuning guide
- [ ] Troubleshooting guide
- [ ] Architecture diagrams
- [ ] Video tutorials

---

## 🤝 Community Features

- [ ] Plugin system for custom metrics
- [ ] Community dashboard templates
- [ ] Integration marketplace
- [ ] Best practices library

---

## Priority Order

1. **High Priority** (Next Sprint)
   - Aggregation queries
   - Basic analytics functions
   - Performance widget for dashboard

2. **Medium Priority** (Q2)
   - Alert system
   - Prometheus exporter
   - Grafana dashboards

3. **Low Priority** (Future)
   - Distributed tracing
   - Regression detection
   - Load testing integration

---

**Last Updated**: July 31, 2026  
**Current Phase**: Phase 1 (Completed)  
**Next Milestone**: Phase 2 - Aggregation & Analytics
