FROM node:20-alpine

WORKDIR /app

# install application dependencies
COPY package*.json ./
RUN npm install

# copy app files
COPY . .

EXPOSE 3002
CMD ["npm", "start"]