# Changelog

All notable changes to `@moon/performance` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-31

### Added

#### Core Models
- **PxRequest** - HTTP request performance tracking model
  - Track method, path, latency, status code
  - Cache status tracking (HIT/MISS/STALE)
  - User agent and IP address logging
  - Request/response size metrics
  - Error message tracking

- **PxQuery** - Database query performance model
  - Track model and operation type
  - Execution time measurement
  - Automatic slow query detection (>100ms threshold)
  - Query hash for grouping similar queries
  - User association via Many2one to vx.user
  - Error tracking and stack trace storage

- **PxCache** - Cache statistics aggregation model
  - Hit/miss/stale counters
  - Average latency calculation
  - TTL and cache size tracking
  - Time window (periodStart/periodEnd)
  - Last access timestamp (auto-updated)

- **PxSystem** - System resource metrics model
  - Memory usage tracking (heap used/total)
  - CPU usage percentage
  - Event loop lag measurement
  - Active/total connection counters
  - Database pool statistics
  - Process uptime tracking

#### Tracker Utilities
- `trackRequest()` - Track HTTP request performance
  - Automatic slow request warning (>500ms)
  - Configurable request metrics
  
- `trackQuery()` - Track database query performance
  - Automatic slow query detection (>100ms)
  - Console warnings for slow queries
  
- `trackSystem()` - Track system resource metrics
  - Memory usage from process.memoryUsage()
  - Uptime from process.uptime()
  
- `updateCacheStats()` - Update cache statistics
  - Increment hit/miss/stale counters
  - Calculate rolling average latency
  - Auto-create new cache entries

#### TypeScript Types
- `RequestMetrics` - Type-safe request tracking interface
- `QueryMetrics` - Type-safe query tracking interface
- `SystemMetrics` - Type-safe system metrics interface

#### Package Structure
- ESM module format
- TypeScript declarations (.d.ts)
- Source maps for debugging
- Follows moon-base addon pattern

#### Integration
- Integrated with NativeServer
- Works with moon-base models
- Dependency on vx.user for query tracking
- Auto-syncing schema with database

#### Testing
- Comprehensive integration test suite
- Validates all tracking functions
- Tests slow query detection
- Verifies database persistence

### Technical Details

#### Field Types Used
- `Char` - String fields with indexing
- `Integer` - Numeric counters and IDs
- `Float` - Precision metrics (latency, percentages)
- `Boolean` - Status flags
- `Text` - Large content (user agent, stack traces)
- `Selection` - Enumerated values (method, operation, cache status)
- `DateTime` - Timestamps with auto-generation
- `Many2one` - Relational field to vx.user

#### Database Schema
All tables auto-created with snake_case naming:
- `px_request` - Request performance records
- `px_query` - Query performance records
- `px_cache` - Cache statistics aggregates
- `px_system` - System metrics snapshots

#### Indexes Created
- `px_request`: method, statusCode, cacheStatus, timestamp, path
- `px_query`: model, operation, executionMs, isSlow, hadError, timestamp
- `px_cache`: cacheKey, periodStart, periodEnd
- `px_system`: timestamp

### Dependencies
- `@moon/orm: workspace:*` - ORM foundation
- Peer dependency: `@moon/base` - Base models (vx.user)

### Dev Dependencies
- `typescript: ^5.0.0`
- `@types/node: ^20.0.0`

---

## [Unreleased]

### Planned
- Aggregation queries (hourly/daily rollups)
- Alert system for thresholds
- Performance dashboard widgets
- Prometheus exporter
- Grafana integration

---

**Package**: `@moon/performance`  
**Repository**: moonwitness monorepo  
**License**: Proprietary
