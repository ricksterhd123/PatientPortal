FROM ubuntu:latest
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get -y install libnss3-tools wget git sudo curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - && sudo apt-get install -y nodejs
RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-amd64
RUN mv mkcert-v1.4.1-linux-amd64 mkcert
RUN chmod 700 mkcert
RUN sudo ./mkcert -install
RUN sudo ./mkcert localhost
RUN cat localhost.pem
RUN cat localhost-key.pem
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD npm start