-- pgvector extension initialization script for PostgreSQL 18
-- This runs during database initialization

CREATE EXTENSION IF NOT EXISTS vector;
-- Verify installation
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Create a test table to verify HNSW indexing capability

