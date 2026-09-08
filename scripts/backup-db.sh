#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"
BACKUP_ROOT="$ROOT_DIR/backups"
TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/mongodb-$TIMESTAMP"
DB_NAME="${DB_NAME:-antuf}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

DB_URI="${DB_URL:-${MONGODB_URI:-}}"

if [[ -z "$DB_URI" ]]; then
  echo "❌ No database URL found. Please set DB_URL or MONGODB_URI in .env.local or your environment."
  exit 1
fi

mkdir -p "$BACKUP_ROOT"

printf '\n🔎 Checking MongoDB connection and creating backup...\n'
printf '📁 Backup directory: %s\n' "$BACKUP_DIR"
printf '🗃️  Database: %s\n' "$DB_NAME"

mongodump --uri="$DB_URI" --db="$DB_NAME" --out="$BACKUP_DIR" --gzip

printf '\n✅ MongoDB backup created successfully.\n'
printf '📍 Location: %s\n' "$BACKUP_DIR"
