#!/usr/bin/env bash
set -euo pipefail

ARCH="${TARGETARCH:-amd64}"
OS="${TARGETOS:-linux}"
IMAGE_TAG="${1:-authelia:prod}"

echo "==> [1/4] Building frontend..."
docker run --rm \
  -v "$(pwd)/web:/node/src/app" \
  -v "$(pwd)/internal:/node/src/internal" \
  -w /node/src/app \
  node:25-alpine \
  sh -c "yarn global add pnpm && pnpm install --frozen-lockfile --ignore-scripts && pnpm build"

echo "==> [2/4] Copying API files..."
cp -r api internal/server/public_html/api

echo "==> [3/4] Building Go binary..."
mkdir -p "authelia-${OS}-${ARCH}"
docker run --rm \
  -v "$(pwd):/go/src/app" \
  -w /go/src/app \
  golang:1.26.4-bookworm \
  bash -c "go mod download && \
    CGO_ENABLED=1 \
    CGO_CPPFLAGS='-D_FORTIFY_SOURCE=2 -fstack-protector-strong' \
    CGO_LDFLAGS='-Wl,-z,relro,-z,now' \
    go build \
      -ldflags '-linkmode=external -s -w' \
      -trimpath \
      -buildmode=pie \
      -buildvcs=false \
      -o authelia-${OS}-${ARCH}/authelia \
      ./cmd/authelia"

echo "==> [4/4] Building Docker image..."
docker pull authelia/base:latest
SHA=$(docker inspect --format='{{index .RepoDigests 0}}' authelia/base:latest | sed 's/.*sha256://')

docker build \
  --build-arg TAG=latest \
  --build-arg "SHA=${SHA}" \
  -f Dockerfile \
  -t "${IMAGE_TAG}" \
  .

echo ""
echo "Build selesai: ${IMAGE_TAG}"
