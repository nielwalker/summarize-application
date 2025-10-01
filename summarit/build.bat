@echo off
echo Starting build process...

echo Generating Prisma client...
npx prisma generate

echo Building Next.js application...
npm run build

echo Build completed successfully!
