mkdir -p ./src/pb/pb_data &&
mkdir -p ./src/pb/pb_hooks &&
( cd ./src/pb && docker compose up -d ) &&
cp ./src/pb/pb_data/types.d.ts ./src/pb/hooks &&
tsc ./src/pb/hooks/*.pb.ts --outDir ./src/pb/pb_hooks --watch