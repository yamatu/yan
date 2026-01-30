FROM node:22-alpine AS deps
WORKDIR /app

# 安裝依賴
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 構建時注入前後端連接相關環境變量
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG INTERNAL_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV INTERNAL_API_URL=${INTERNAL_API_URL}

# 構建 Next.js 應用（生產環境）
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 只拷貝運行所需文件，保持鏡像精簡
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 3001

# 以生產模式啟動 Next.js，端口為 3001
CMD ["npm", "run", "start", "--", "-p", "3001"]
