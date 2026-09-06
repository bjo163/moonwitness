# 🏗️ Moonwitness Foundation Roadmap

> **Tujuan:** Memperkuat fondasi ORM, packages, dan arsitektur untuk skalabilitas jangka panjang

---

## 📊 Status Saat Ini

### ✅ Yang Sudah Solid
- **moon-orm**: Core ORM dengan Vertex base class, field types, migrations
- **moon-server**: Native HTTP server dengan REST API, auth, WebSocket
- **moon-base**: Base models (User, Role, Model, Grant, Rule, Metric, Session)
- **moon-client**: Type-safe client untuk komunikasi dengan API
- **moon-performance**: Performance monitoring (baru dibuat)

### ⚠️ Yang Perlu Diperkuat
- Validation layer belum centralized
- Caching strategy belum unified
- Transaction handling belum robust
- Testing framework belum ada
- Documentation masih minimal
- Error handling belum standardized

---

## 🎯 Prioritas Penguatan

### **TIER 1 - Critical Foundation (1-2 minggu)**

#### 1. **moon-validation** 📋
**Kenapa:** Setiap input perlu validated, sekarang scattered di banyak tempat

**Fitur:**
```typescript
// Schema validation
const userSchema = validate.object({
  email: validate.email().required(),
  password: validate.string().min(8).pattern(/[A-Z]/).required(),
  age: validate.number().min(18).max(120).optional(),
  role: validate.enum(['admin', 'user', 'guest']),
  profile: validate.object({
    name: validate.string().required(),
    bio: validate.string().max(500)
  })
})

// Field-level validation in ORM
class VxUser extends Vertex {
  email = fields.Char({ 
    required: true,
    validate: validate.email()
  })
  
  password = fields.Char({
    required: true,
    validate: validate.password().min(8).hasUppercase().hasNumber()
  })
}

// Request validation middleware
server.post('/api/users', 
  validateBody(userSchema),
  async (req, res) => { ... }
)
```

**Struktur:**
```
packages/moon-validation/
├── src/
│   ├── index.ts
│   ├── validators.ts       # email, url, uuid, etc
│   ├── schema.ts           # object, array schema
│   ├── rules.ts            # custom rules
│   ├── messages.ts         # error messages (i18n ready)
│   └── middleware.ts       # Express/HTTP middleware
└── tests/
```

---

#### 2. **moon-cache** 💾
**Kenapa:** Caching logic sekarang ada di proxy.ts, perlu di-generalize

**Fitur:**
```typescript
// Multi-backend cache
const cache = new CacheManager({
  default: 'memory',
  stores: {
    memory: new MemoryStore({ max: 1000, ttl: 60000 }),
    redis: new RedisStore({ url: 'redis://localhost:6379' }),
    database: new DatabaseStore({ model: 'mx.cache' })
  }
})

// Usage
await cache.get('user:123')
await cache.set('user:123', userData, { ttl: 300 })
await cache.delete('user:123')
await cache.tags(['users', 'auth']).flush()

// Decorator pattern
class UserService {
  @Cacheable({ key: 'user:${id}', ttl: 300 })
  async getUser(id: number) {
    return await User.browse([id])
  }
  
  @CacheInvalidate({ pattern: 'user:*' })
  async updateUser(id: number, data: any) {
    return await User.morph(id, data)
  }
}

// ORM integration
class VxUser extends Vertex {
  static _cache = {
    enabled: true,
    ttl: 300,
    tags: ['users'],
    invalidateOn: ['write', 'delete']
  }
}
```

**Struktur:**
```
packages/moon-cache/
├── src/
│   ├── index.ts
│   ├── manager.ts          # CacheManager
│   ├── stores/
│   │   ├── memory.ts
│   │   ├── redis.ts
│   │   └── database.ts
│   ├── decorators.ts       # @Cacheable, @CacheInvalidate
│   ├── tags.ts             # Tag-based invalidation
│   └── orm-integration.ts  # Auto-cache for ORM
└── tests/
```

---

#### 3. **moon-queue** 🚀
**Kenapa:** Background jobs, async processing, scheduled tasks perlu proper queue

**Fitur:**
```typescript
// Job definition
@Job({ queue: 'emails', retry: 3, backoff: 'exponential' })
class SendEmailJob {
  async handle(data: { to: string, subject: string, body: string }) {
    await emailService.send(data)
  }
}

// Dispatch job
await queue.dispatch(SendEmailJob, {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Hello world'
})

// Scheduled jobs (cron)
@Schedule('0 0 * * *') // Every midnight
class DailyReportJob {
  async handle() {
    await generateDailyReport()
  }
}

// Queue worker
const worker = new QueueWorker({
  queues: ['emails', 'reports', 'cleanup'],
  concurrency: 5
})
await worker.start()
```

**Struktur:**
```
packages/moon-queue/
├── src/
│   ├── index.ts
│   ├── manager.ts          # QueueManager
│   ├── worker.ts           # QueueWorker
│   ├── job.ts              # Job base class
│   ├── scheduler.ts        # Cron scheduler
│   ├── stores/
│   │   ├── memory.ts
│   │   ├── redis.ts        # Bull/BullMQ
│   │   └── database.ts     # DB-backed queue
│   └── decorators.ts       # @Job, @Schedule
└── tests/
```

---

### **TIER 2 - Developer Experience (2-3 minggu)**

#### 4. **moon-testing** 🧪
**Kenapa:** Testing sekarang manual, perlu framework untuk TDD

**Fitur:**
```typescript
// Model testing
describe('VxUser', () => {
  let env: TestEnv
  
  beforeEach(async () => {
    env = await createTestEnv()
  })
  
  afterEach(async () => {
    await env.cleanup()
  })
  
  test('should create user with hashed password', async () => {
    const user = await VxUser.spawn(VxUser, env, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })
    
    expect(user.password).not.toBe('password123')
    expect(user.password).toMatch(/^\$2[aby]\$/)
  })
})

// API testing
describe('POST /api/users', () => {
  test('should return 201 with valid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test', email: 'test@example.com' })
      .expect(201)
    
    expect(res.body).toHaveProperty('id')
  })
})

// Factory pattern
const userFactory = factory(VxUser, {
  name: () => faker.name.fullName(),
  email: () => faker.internet.email(),
  password: 'password123'
})

const user = await userFactory.create()
const users = await userFactory.createMany(10)
```

**Struktur:**
```
packages/moon-testing/
├── src/
│   ├── index.ts
│   ├── env.ts              # TestEnv, createTestEnv
│   ├── factories.ts        # Factory pattern
│   ├── matchers.ts         # Custom Jest matchers
│   ├── fixtures.ts         # Test fixtures
│   └── helpers.ts          # Test utilities
└── tests/
```

---

#### 5. **moon-events** 📡
**Kenapa:** Event-driven architecture untuk decoupling modules

**Fitur:**
```typescript
// Event emitter
events.on('user.created', async (user) => {
  await queue.dispatch(SendWelcomeEmailJob, { userId: user.id })
  await cache.tags(['users']).flush()
})

events.on('user.updated', async (user) => {
  await trackQuery({ model: 'vx.user', operation: 'UPDATE' })
})

// Model lifecycle hooks
class VxUser extends Vertex {
  @BeforeCreate()
  static async beforeCreate(env: Ctx, vals: any) {
    vals.createdAt = new Date()
    events.emit('user.before_create', vals)
  }
  
  @AfterCreate()
  static async afterCreate(env: Ctx, record: any) {
    events.emit('user.created', record)
  }
  
  @AfterUpdate()
  static async afterUpdate(env: Ctx, record: any, changes: any) {
    events.emit('user.updated', { record, changes })
  }
}

// Global events
events.on('orm.query.slow', async ({ model, query, duration }) => {
  logger.warn(`Slow query on ${model}: ${duration}ms`)
  await trackQuery({ model, executionMs: duration, isSlow: true })
})
```

**Struktur:**
```
packages/moon-events/
├── src/
│   ├── index.ts
│   ├── emitter.ts          # EventEmitter
│   ├── lifecycle.ts        # ORM lifecycle hooks
│   ├── decorators.ts       # @BeforeCreate, @AfterUpdate, etc
│   └── types.ts            # Event types
└── tests/
```

---

#### 6. **moon-logger** 📝
**Kenapa:** Logging sekarang basic console.log, perlu structured logging

**Fitur:**
```typescript
// Structured logging
logger.info('User created', {
  userId: user.id,
  email: user.email,
  timestamp: new Date()
})

// Context logging
const requestLogger = logger.child({ requestId: uuid() })
requestLogger.info('Request started')
requestLogger.error('Request failed', { error: err.message })

// Log levels
logger.debug('Debug info')
logger.info('Info message')
logger.warn('Warning')
logger.error('Error', { error })
logger.fatal('Fatal error')

// Multiple transports
const logger = new Logger({
  level: 'info',
  transports: [
    new ConsoleTransport({ format: 'pretty' }),
    new FileTransport({ path: 'logs/app.log', format: 'json' }),
    new DatabaseTransport({ model: 'mx.log' }),
    new SentryTransport({ dsn: '...' })
  ]
})
```

**Struktur:**
```
packages/moon-logger/
├── src/
│   ├── index.ts
│   ├── logger.ts           # Logger class
│   ├── transports/
│   │   ├── console.ts
│   │   ├── file.ts
│   │   ├── database.ts
│   │   └── sentry.ts
│   ├── formatters.ts       # JSON, pretty, etc
│   └── context.ts          # Request context
└── tests/
```

---

### **TIER 3 - Advanced Features (3-4 minggu)**

#### 7. **moon-security** 🔒
**Kenapa:** Security perlu centralized (CSRF, XSS, rate limiting, etc)

**Fitur:**
- CSRF protection
- XSS sanitization
- SQL injection prevention
- Rate limiting per user/IP
- API key management
- OAuth2/OpenID integration
- 2FA/MFA support

#### 8. **moon-search** 🔍
**Kenapa:** Full-text search, faceted search, advanced queries

**Fitur:**
- Full-text search integration (Elasticsearch/MeiliSearch)
- Fuzzy search
- Faceted filtering
- Autocomplete/typeahead
- Search analytics

#### 9. **moon-files** 📁
**Kenapa:** File upload, storage, CDN integration

**Fitur:**
- Multi-storage backends (local, S3, GCS, Azure)
- Image processing (resize, crop, watermark)
- File validation (size, type, virus scan)
- CDN integration
- Metadata extraction

#### 10. **moon-notifications** 🔔
**Kenapa:** Unified notification system

**Fitur:**
- Email notifications
- Push notifications (Web Push, FCM)
- SMS notifications
- In-app notifications
- Notification preferences
- Templates

---

## 🏛️ Arsitektur Pattern yang Perlu Diterapkan

### 1. **Repository Pattern**
```typescript
// Separate business logic from data access
class UserRepository {
  async findByEmail(email: string) {
    return await VxUser.search([['email', '=', email]], { limit: 1 })
  }
  
  async createWithProfile(userData: any, profileData: any) {
    // Complex business logic here
  }
}
```

### 2. **Service Layer**
```typescript
// Business logic layer
class AuthService {
  constructor(
    private userRepo: UserRepository,
    private cache: CacheManager,
    private queue: QueueManager
  ) {}
  
  async register(data: any) {
    // Validate
    // Create user
    // Send welcome email
    // Track metrics
  }
}
```

### 3. **Dependency Injection**
```typescript
// IoC container
const container = new Container()
container.bind(UserRepository).toSelf()
container.bind(AuthService).toSelf()

// Usage
const authService = container.get(AuthService)
```

### 4. **Event Sourcing (Optional - Advanced)**
```typescript
// Store events instead of state
events.emit('user.registered', { userId, email, timestamp })
events.emit('user.email_verified', { userId, timestamp })
events.emit('user.profile_updated', { userId, changes, timestamp })

// Rebuild state from events
const userState = await eventStore.replay('user:123')
```

---

## 📚 Documentation Priority

1. **Architecture Decision Records (ADRs)**
   - Mengapa pilih Postgres
   - Mengapa custom ORM vs Prisma/TypeORM
   - REST API structure

2. **API Documentation**
   - OpenAPI spec yang sudah ada perlu di-enhance
   - Interactive docs (Swagger UI)
   - Code examples per endpoint

3. **Developer Guide**
   - Getting started
   - Creating models
   - Writing migrations
   - Adding packages

4. **Deployment Guide**
   - Docker setup
   - Environment variables
   - Database migrations
   - Monitoring setup

---

## 🎬 Action Plan - Next 2 Weeks

### Week 1
- [ ] Create **moon-validation** package
- [ ] Create **moon-cache** package
- [ ] Integrate validation into existing models
- [ ] Integrate cache into proxy routes

### Week 2
- [ ] Create **moon-queue** package
- [ ] Create **moon-events** package
- [ ] Refactor performance tracking to use events
- [ ] Write tests for new packages

---

## 💡 Quick Wins (Bisa dikerjakan sekarang)

### 1. **Add TypeScript Strict Mode**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. **Add Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"]
  }
}
```

### 3. **Add Health Check Endpoint**
```typescript
server.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      queue: await checkQueue()
    }
  }
  res.json(health)
})
```

### 4. **Add Request ID Tracking**
```typescript
server.use((req, res, next) => {
  req.id = uuid()
  res.setHeader('X-Request-ID', req.id)
  next()
})
```

### 5. **Add Graceful Shutdown**
```typescript
process.on('SIGTERM', async () => {
  await server.close()
  await db.close()
  await cache.close()
  await queue.close()
  process.exit(0)
})
```

---

## 🎯 Success Metrics

- [ ] Test coverage > 80%
- [ ] API response time < 100ms (p95)
- [ ] Zero downtime deployments
- [ ] < 1% error rate
- [ ] 100% API documentation coverage
- [ ] Developer onboarding < 1 hour

---

## 🤔 Questions to Answer

1. **Apakah perlu microservices atau monolith masih OK?**
   - Saat ini monolith OK untuk MVP
   - Bisa split nanti jika ada bottleneck

2. **Apakah perlu GraphQL atau REST sudah cukup?**
   - REST + RPC sudah cukup untuk sekarang
   - GraphQL bisa jadi layer tambahan nanti

3. **Database: Single DB atau multiple DBs?**
   - Single Postgres dengan schemas berbeda
   - Bisa scale dengan read replicas

4. **Deployment: Serverless atau VPS?**
   - VPS lebih predictable cost
   - Vercel untuk frontend OK

---

**Prioritas Tertinggi:**
1. moon-validation ⭐⭐⭐
2. moon-cache ⭐⭐⭐
3. moon-testing ⭐⭐
4. moon-queue ⭐⭐
5. moon-events ⭐

Mana yang mau dikerjakan duluan? 🚀
