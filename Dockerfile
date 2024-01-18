FROM node:latest

WORKDIR /usr/src/app

#deps
COPY package*.json ./
RUN npm install

# make img
COPY . .

# expose for docker daemon
EXPOSE 3000
CMD ["npm", "start"]
