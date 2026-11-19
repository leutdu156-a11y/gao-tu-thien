#!/usr/bin/env bash
set -euo pipefail

# Đường dẫn thư mục dự án
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRATCH_DIR="$(dirname "$PROJECT_DIR")"
TIMESTAMP="$(date +%Y%m%d-%H%M)"
REMOTE_HOSTINGER="https://github.com/hongnguyenrice/gao-tu-thien.git"
REMOTE_ORIGIN="https://github.com/leutdu156-a11y/gao-tu-thien.git"

DEPLOY_TMP="$(mktemp -d)"
trap 'rm -rf "$DEPLOY_TMP"' EXIT

echo "🚀 [1/4] Build Next.js Static Export..."
cd "$PROJECT_DIR"
npm run build

echo "📦 [2/4] Đồng bộ bản tĩnh nối tiếp vào nhánh deploy (không force-push)..."
if git clone --depth 1 --branch deploy --single-branch "$REMOTE_HOSTINGER" "$DEPLOY_TMP" -q 2>/dev/null; then
  :
else
  git init -q "$DEPLOY_TMP"
  git -C "$DEPLOY_TMP" checkout -b deploy -q
fi

# Ghi đè toàn bộ nội dung từ out/ và xóa các file cũ không còn trong bản build (giữ nguyên .git)
rsync -a --delete --exclude='.git' "$PROJECT_DIR/out/" "$DEPLOY_TMP/"

cd "$DEPLOY_TMP"
git add -A
if [ -n "$(git status --porcelain)" ]; then
  git commit -m "deploy: update static build $TIMESTAMP" -q
  echo "🌐 [3/4] Đẩy commit nối tiếp (fast-forward) lên GitHub hongnguyenrice & leutdu156-a11y..."
  git push "$REMOTE_HOSTINGER" deploy:deploy -q
  git push "$REMOTE_ORIGIN" deploy:deploy -q
else
  echo "🌐 [3/4] Bản build tĩnh không có thay đổi so với nhánh deploy hiện tại (bỏ qua push)."
fi

echo "🗜️ [4/4] Đóng gói zip lưu trữ chuẩn YYYYMMDD-HHMM..."
ZIP_NAME="hostinger-gaotuthien-${TIMESTAMP}.zip"
DOWNLOADS_DIR="/Users/leutdu/Downloads"
cd "$PROJECT_DIR/out"
rm -f "$DOWNLOADS_DIR"/hostinger-gaotuthien-*.zip
rm -f "$SCRATCH_DIR"/hostinger-gaotuthien-*.zip
zip -r -q "$DOWNLOADS_DIR/$ZIP_NAME" . -x ".git*" -x ".DS_Store" -x "__MACOSX*"

echo "✅ Hoàn tất deploy!"
echo "   - GitHub Hostinger: https://github.com/hongnguyenrice/gao-tu-thien (nhánh deploy)"
echo "   - GitHub repo gốc: https://github.com/leutdu156-a11y/gao-tu-thien (nhánh deploy)"
echo "   - File zip dự phòng trong Downloads: $DOWNLOADS_DIR/$ZIP_NAME"
