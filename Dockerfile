 
FROM node:20.13.1-alpine3.19 as build
WORKDIR /app/src
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . ./
RUN npm run build

FROM node:20.13.1-alpine3.19
RUN addgroup -S optimatincorporation && adduser -S optimatincorporationuser -G optimatincorporation
USER optimatincorporationuser
WORKDIR /usr/app
COPY --from=build /app/src/dist/optimatincorporation/ ./
CMD node server/server.mjs
EXPOSE 4000
