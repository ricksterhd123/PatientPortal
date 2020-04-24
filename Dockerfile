FROM node:latest
WORKDIR /usr/src/app
# Install node dependencies
COPY package.json .
RUN npm install
# Start the web app
COPY . .
CMD npm start