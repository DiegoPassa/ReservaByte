FROM node:18.10-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4200

# CMD ["npm", "run", "start-on-docker"]
CMD ["npm", "start"]