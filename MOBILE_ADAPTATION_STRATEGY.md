# CORTEX-PRIME Mobile Adaptation - Implementation Strategy

**Document Status**: Phase 1 Complete - Ready for Phase 2  
**Last Updated**: 2026-05-21  
**Target Timeline**: 8-12 weeks  

---

## ✅ Phase 1: Evaluation & Setup (COMPLETE)

### What Was Done
1. ✅ **Comprehensive Project Evaluation** (523-line detailed report)
   - Backend architecture analysis (Python scripts, APIs, file system)
   - Frontend analysis (React components, Capacitor config, mobile readiness)
   - Integration gaps (no API server, no sync mechanism)
   - Critical blockers identified (file system dependency, UI paradigm mismatch)

2. ✅ **Created requirements.txt** (comprehensive Python dependencies)
   - AI/LLM: google-generativeai, openai
   - Backend: fastapi, uvicorn, sqlalchemy
   - Auth: python-jose, passlib, bcrypt
   - Tools: python-frontmatter, markdown, requests
   - Quality: pytest, black, flake8, mypy

3. ✅ **Backend server skeleton created** (FastAPI foundation)
   - Main.py template with CORS, middleware, exception handlers
   - Configuration management ready
   - Router structure prepared

4. ✅ **Updated project tracking** (SQL todos with dependencies)
   - 9 major work items tracked
   - Dependencies mapped (design → setup → adapt)
   - Status updates automated

---

## 🚀 Phase 2: FastAPI Backend (NEXT - 2-3 weeks)

### Must Do (Critical Path)
1. **Create FastAPI server** (Days 1-2)
   - Copy backend_main.py → backend/main.py
   - Add config.py for settings management
   - Implement logging

2. **Implement JWT Authentication** (Days 3-5)
   - POST /api/v1/auth/login (username/password → JWT)
   - POST /api/v1/auth/refresh (refresh token logic)
   - GET /api/v1/auth/me (current user info)
   - Middleware to protect routes

3. **Refactor Synergy Spark** (Days 6-10)
   - Extract synergy_spark.py logic into API endpoint
   - Create: POST /api/v1/vault/scan (replace os.walk)
   - Implement vault file abstraction layer
   - Cache embeddings in SQLite instead of JSON

4. **Create CRUD endpoints** (Days 11-14)
   - GET /api/v1/notes
   - GET /api/v1/notes/{id}
   - POST /api/v1/notes (create new note)
   - PUT /api/v1/notes/{id} (update note)
   - DELETE /api/v1/notes/{id}

5. **AnkiConnect bridge** (Days 15-16)
   - POST /api/v1/anki/sync (bridge Anki from backend)
   - Handle localhost:8765 → remote access pattern

### Implementation Checklist
- [ ] git init backend/ with src structure
- [ ] Copy backend_main.py to backend/
- [ ] Create routers/ subdirectory
- [ ] Create models/ for Pydantic schemas
- [ ] Create utils/ for helpers
- [ ] Set up .env template
- [ ] Test health endpoint: GET /health
- [ ] Test with curl: `curl http://localhost:8000`

### Files to Create
```
backend/
├── main.py                 # FastAPI app (DONE: backend_main.py)
├── config.py              # Settings management
├── database.py            # SQLAlchemy setup
├── models/
│   ├── __init__.py
│   ├── user.py            # User schema
│   ├── note.py            # Note schema
│   └── vault.py           # Vault schema
├── routers/
│   ├── __init__.py
│   ├── auth.py            # JWT endpoints
│   ├── vault.py           # Vault operations
│   ├── notes.py           # CRUD endpoints
│   ├── scripts.py         # Script execution
│   └── system.py          # Health checks
├── utils/
│   ├── __init__.py
│   ├── security.py        # JWT & password utils
│   ├── gemini_client.py   # Refactored (copy from scripts/)
│   └── vault_scanner.py   # Refactored file I/O
├── .env.example           # Template
└── requirements.txt       # ✅ DONE
```

---

## 📱 Phase 3: Mobile UI Adaptation (Weeks 7-10)

### Key Changes
1. **Split App.jsx** (174KB → components)
   - DashboardWindow.jsx
   - InboxWindow.jsx
   - ScheduleWindow.jsx
   - VaultBrowser.jsx
   - SynergySpark.jsx

2. **Add responsive layouts**
   - Mobile breakpoint: < 768px
   - Replace window paradigm with navigation drawer
   - Bottom navigation for primary actions
   - Swipe gestures instead of drag

3. **Implement data fetching**
   - Axios HTTP client
   - React Query for caching
   - Error boundaries

4. **Add offline support**
   - IndexedDB for vault caching
   - Service worker registration
   - Sync queue for failed requests

### UI Components Needed
```jsx
<MobileLayout>          // Wrapper for mobile
  <TopBar />           // Status & settings
  <MainContent />      // Dynamic content area
  <BottomNav />        // Navigation: Inbox, Vault, Calendar, Synergy, Settings
  <OfflineIndicator /> // "⚠ Offline mode"
  <SyncStatus />       // "Syncing... 3/10"
</MobileLayout>
```

---

## 🔄 Phase 4: Sync Engine (Weeks 11-14)

### Offline-First Architecture
1. **Local Storage** → IndexedDB (50-100MB)
   - All vault notes replicated
   - Metadata indexed for fast search
   - Last sync timestamp

2. **Background Sync**
   - Service Worker detects network changes
   - Enqueue failed mutations
   - Retry exponential backoff

3. **Conflict Resolution**
   - Client → Server wins (optimistic updates)
   - Timestamp-based merge
   - Manual conflict UI if needed

4. **Real-time Sync**
   - WebSocket for updates from server
   - Broadcast channel for multi-tab
   - Server-sent events fallback

---

## 🧪 Phase 5: Testing & Deployment (Weeks 15-16)

### Testing Coverage
- ✅ Unit tests: API endpoints, auth, data models
- ✅ Integration tests: Vault operations, Gemini calls
- ✅ E2E tests: Mobile app flows
- ✅ Performance: Load testing, cache hit rates

### Deployment
- Docker container for backend
- Environment management (dev/staging/prod)
- Android build via Capacitor
- iOS build via Capacitor

---

## 📊 Progress Tracking (Live SQL Database)

```sql
-- Check status
SELECT id, title, status FROM todos ORDER BY id;

-- Update when starting work
UPDATE todos SET status = 'in_progress' WHERE id = 'design-api-bridge';

-- Mark complete
UPDATE todos SET status = 'done' WHERE id = 'setup-express-server';
```

---

## ⚠️ Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Python subprocess calls too slow | Mobile API latency | Implement job queue (Celery) |
| File system abstraction complex | Sync conflicts | Design schema first, test early |
| Anki sync fails from mobile | Cannot create flashcards | Mock Anki in dev, test separately |
| Offline sync collision | Data loss | Implement last-write-wins + timestamps |
| Large vault slows down IndexedDB | Performance | Paginate queries, lazy load notes |

---

## 🎯 Success Criteria

✅ **Phase 2 Done When**:
- FastAPI server starts: `python backend/main.py` → "Application startup complete"
- Auth works: POST /api/v1/auth/login returns JWT token
- Vault scan works: GET /api/v1/vault/synergies returns JSON
- Notes CRUD works: Full create/read/update/delete cycle
- Mobile can reach server over HTTPS

✅ **Phase 3 Done When**:
- App responsive on 320px-768px viewports
- All 5 main windows converted to mobile screens
- Tap/swipe interactions work smoothly
- No console errors

✅ **Phase 4 Done When**:
- IndexedDB populated with vault data
- Service worker registers successfully
- Offline actions queue and sync when online
- Conflict resolution tested

✅ **Phase 5 Done When**:
- All E2E tests pass
- Android APK builds
- iOS IPA builds
- 95%+ Lighthouse score for mobile

---

## 📞 Next Steps

1. **Day 1**: Create `backend/main.py` from skeleton
2. **Day 2-3**: Implement auth routes with JWT
3. **Day 4-5**: Create database models with SQLAlchemy
4. **Day 6-7**: Refactor synergy_spark.py into API endpoint
5. **Day 8-10**: Create vault CRUD endpoints
6. **Week 3**: AnkiConnect bridge + testing

**Start Phase 2 now? Yes → Create backend/ directory structure**

---

*CORTEX-PRIME Mobile Adaptation - Strategic Implementation Plan*  
*Created by AI Assistant | Reviewed by Project Owner*
