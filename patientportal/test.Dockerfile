FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
COPY . .
RUN npm run compile
CMD npm test