# Fantan

[![Node Docker CI](https://github.com/sqooid/fantan/actions/workflows/main.yml/badge.svg)](https://github.com/sqooid/fantan/actions/workflows/main.yml)

## Development

TODO: Upgrade to `typescript@5.6` for the `--noCheck` compiler option on Pocketbase hooks then use:

```
"dev:api": "mkdir -p ./src/pb/pb_data/pb_hooks && pnpm dev:pb && cp ./src/pb/pb_data/types.d.ts ./src/pb/hooks && tsc ./src/pb/hooks/*.ts --outDir ./src/pb/pb_data/pb_hooks --noCheck --watch",
```
