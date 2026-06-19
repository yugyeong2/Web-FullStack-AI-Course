#!/usr/bin/env bash
set -e

TEMPLATE_REPO="https://github.com/wrappixel/MaterailM-Free-Bootstrap-Admin-Template.git"
TEMP_DIR=".tmp-materialm-template"

echo "MaterialM Free Bootstrap Admin Template 다운로드 중..."

rm -rf "$TEMP_DIR"
git clone --depth 1 "$TEMPLATE_REPO" "$TEMP_DIR"

echo "기존 MaterialM 에셋 제거 중..."
rm -rf src/public/assets

echo "MaterialM 에셋 복사 중..."
cp -R "$TEMP_DIR/src/assets" src/public/assets

rm -rf "$TEMP_DIR"

echo "완료: src/public/assets 복원됨"
