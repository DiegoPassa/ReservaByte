FROM node:18.10-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3080
# CMD [ "node", "dist/index.js"]
CMD ["npm", "run", "dev"]