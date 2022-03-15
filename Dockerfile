# Build TypeScript
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./
RUN npm ci --ignore-scripts

COPY src ./src
RUN npm run build

# Generate the final image
FROM node:16-alpine

ENV TELEGRAM_TOKEN=1234567890:xxxxxxxxxxxxxxxxxxxxxxxx
ENV EXTERNAL_ADDRESS=https://this.bot.address:8443
ENV PORT=8443
ENV IPMI_URL=https://ipmi.mydomain.com
ENV IPMI_CREDENTIALS=username:password

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --ignore-scripts --only=production

COPY ./ssl/*.pem ./ssl/
COPY --from=0 /usr/src/app/dist ./dist

CMD [ "npm", "run", "start:release" ]
