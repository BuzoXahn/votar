FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json ./
RUN pnpm install

FROM base AS development
COPY . .
RUN pnpm db:generate
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS build
COPY . .
RUN pnpm db:generate
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main"]
