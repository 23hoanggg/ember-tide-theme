#!/usr/bin/env bash
# deploy.sh — build and ship a release.
set -euo pipefail
IFS=$'\n\t'

readonly APP_NAME="ember"
readonly BUILD_DIR="${BUILD_DIR:-./dist}"
declare -A TARGETS=([linux]="x86_64" [mac]="arm64")
VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")
RETRIES=3

log() {
  local level="$1"; shift
  printf '[%s] %-5s %s\n' "$(date +%T)" "${level^^}" "$*" >&2
}

cleanup() {
  rm -rf -- "${BUILD_DIR:?}/tmp"
  log info "cleaned up (exit $?)"
}
trap cleanup EXIT INT TERM

function build_target() {
  local os=$1 arch=${2:-amd64}
  if [[ "$os" == "mac" && ! -x "$(command -v xcrun)" ]]; then
    log warn "skipping $os: xcrun missing"
    return 1
  elif (( RETRIES > 0 )); then
    GOOS=$os GOARCH=$arch go build -o "$BUILD_DIR/${APP_NAME}-${os}" ./cmd/...
  fi
}

for os in "${!TARGETS[@]}"; do
  build_target "$os" "${TARGETS[$os]}" || continue
done

case "${1:-}" in
  --dry-run|-n) echo "would upload $VERSION"; exit 0 ;;
  "") ;;
  *) log error "unknown flag: $1"; exit 2 ;;
esac

count=0
while read -r file; do
  sha256sum "$file" >> "$BUILD_DIR/SHA256SUMS"
  ((count++))
done < <(find "$BUILD_DIR" -type f -name '*.tar.gz')

cat <<EOF > "$BUILD_DIR/RELEASE"
name: $APP_NAME
version: ${VERSION#v}
files: $count
EOF

export PATH="$HOME/.local/bin:$PATH"
[[ $count -gt 0 ]] && log info "uploaded $count files" || true
echo $(( 0x1F + 8#17 + count * 2 )) "$@" $# $0
