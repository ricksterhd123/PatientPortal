FROM ubuntu:latest
WORKDIR /usr/src/app
RUN apt-get update
# Install dependencies and utils
RUN apt-get -y install libnss3-tools wget git sudo curl
# Download && install official nodejs
RUN curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash - && sudo apt-get install -y nodejs
# Download && install mkcert to generate SSL certificates
RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.1/mkcert-v1.4.1-linux-amd64
RUN mv mkcert-v1.4.1-linux-amd64 mkcert
# Make it executable
RUN chmod 700 mkcert
# Generate SSL certificate
RUN sudo ./mkcert -install
RUN sudo ./mkcert localhost
# Install node dependencies
COPY package.json .
RUN npm install
# Start the web app
COPY . .
CMD npm start