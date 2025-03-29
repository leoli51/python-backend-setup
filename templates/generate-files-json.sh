#!/bin/bash

# Base directory (default to ./templates)
BASE_DIR="${1:-./templates}"

# Check for jq
if ! command -v jq >/dev/null; then
  echo "❌ jq is required. Install it with 'apt install jq' or 'brew install jq'."
  exit 1
fi

# Loop through each top-level subdirectory
for top_dir in "$BASE_DIR"/*/; do
  [ -d "$top_dir" ] || continue

  echo "📁 Processing $top_dir..."

  files=()
  # Recursively find all files under this top-level dir, relative to it
  while IFS= read -r -d '' file; do
    relpath=$(realpath --relative-to="$top_dir" "$file")
    [[ "$relpath" == "files.json" ]] && continue
    files+=("$relpath")
  done < <(find "$top_dir" -type f -print0)

  # Output JSON to files.json inside this top-level dir
  if [ ${#files[@]} -gt 0 ]; then
    printf "%s\n" "${files[@]}" | jq -R . | jq -s . > "${top_dir}/files.json"
    echo "✅ Created ${top_dir}files.json"
  else
    echo "⚠️  No files found in $top_dir (skipped)"
  fi
done

echo "🎉 Done!"
