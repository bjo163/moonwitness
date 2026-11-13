 # Witness API Reference
 
 ## Base URL
 
 ```
 /api/witness
 ```
 
 ## Endpoints
 
 ### Search
 
 ```
 GET /api/witness/search?q={query}&limit={limit}&offset={offset}
 ```
 
 Full-text search across Quran, Hadith, and knowledge graph.
 
 **Parameters:**
 - `q` (string, required): Search query
 - `limit` (integer, default: 20): Results per page
 - `offset` (integer, default: 0): Pagination offset
 
 **Response:**
 ```json
 {
   "results": [
     {
       "id": "quran:1:1",
       "type": "scripture",
       "title": "Al-Fatihah 1",
       "content": "...",
       "source": "tanzil",
       "provenance": { ... }
     }
   ],
   "total": 42,
   "page": 1
 }
 ```
 
 ### Lookup
 
 ```
 GET /api/witness/lookup?ref={reference}
 ```
 
 Direct passage lookup by stable reference.
 
 **Parameters:**
 - `ref` (string, required): Stable reference (e.g., `quran:1:1`, `bukhari:1`)
 
 **Response:**
 ```json
 {
   "id": "quran:1:1",
   "content": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
   "translations": [
     {
       "language": "id",
       "text": "Dengan nama Allah...",
       "source": "kemenag"
     }
   ],
   "source": "tanzil",
   "provenance": { ... }
 }
 ```
 
 ### Quran Surahs
 
 ```
 GET /api/witness/quran/surahs
 ```
 
 List all Quran surahs with metadata.
 
 ### Hadith Books
 
 ```
 GET /api/witness/hadith/books
 ```
 
 List all Hadith collections.
 
 ### Graph Relations
 
 ```
 GET /api/witness/graph/relations?entity={entityId}&depth={depth}
 ```
 
 Entity relationship graph traversal.
