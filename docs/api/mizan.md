 # Mizan API Reference
 
 ## Base URL
 
 ```
 /api/mizan
 ```
 
 ## Endpoints
 
 ### Evaluate Assessment
 
 ```
 POST /api/mizan/evaluate
 ```
 
 Run Mizan assessment evaluation.
 
 **Request Body:**
 ```json
 {
   "request_key": "sha256-hash",
   "assessment_id": "mz.assessment,123",
   "profile_code": "mizan_weighted@1.0.0",
   "profile_version": 1,
   "source_revision": "abc123",
   "lines": [...],
   "general_sufficient": true,
   "balance_state": "balanced",
   "reference_weight": 2
 }
 ```
 
 **Response:**
 ```json
 {
   "assessment_id": "mz.assessment,123",
   "method": "general_limited",
   "score_available": true,
   "score_max": 17,
   "score_raw": 14,
   "eligible_for_prophetic": false,
   "engine_status": "evaluated",
   "engine_version": "mizan_weighted@1.0.0",
   "contract_version": "1.0.0",
   "input_hash": "...",
   "output_hash": "..."
 }
 ```
 
 ### Assessment Summary
 
 ```
 GET /api/mizan/summary?assessment_id={id}
 ```
 
 Get assessment summary with scores and status.
 
 ### List Cases
 
 ```
 GET /api/mizan/cases
 ```
 
 List Mizan cases.
