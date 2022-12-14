FROM --platform=linux/amd64 node:alpine

WORKDIR /app

COPY src /app/src/
COPY package*.json /app/
COPY tsconfig.json /app/
RUN npm install
RUN npm run build

EXPOSE 8081
CMD ["node", "dist/app.js"]

# need to implement 2 stage Docker build eventually