##!/bin/bash

timestamp=$(date +%s)
name=$1
dir=$(dirname $0)
migrations_dir="$dir/../src/pb/migrations"

if [ -z "$name" ]; then
  echo "Usage: $0 <name>"
  exit 1
fi

if [ -z "$migrations_dir" ]; then
  echo "Migrations directory not found"
  exit 1
fi

migration_file="$migrations_dir/${timestamp}_${name}.ts"
echo '
migrate((db) => {
    // add up queries...
}, (db) => {
    // add down queries...
});
' > $migration_file
