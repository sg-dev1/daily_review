#!/bin/bash
rm -rf node_modules
rm -rf apps/backend/node_modules/
rm -rf apps/docs/node_modules/
rm -rf apps/frontend/node_modules/
rm -rf packages/shared/node_modules/
rm -rf apps/web/node_modules/
rm -rf packages/eslint-config/node_modules/
rm -rf packages/ui/node_modules/
rm -rf packages/eslint-config/node_modules/
rm -rf out


#
# Following steps are to reverse the steps done by this script:
#
# pnpm install
# turbo build
# turbo prune backend --docker
#