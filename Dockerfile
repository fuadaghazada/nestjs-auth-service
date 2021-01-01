FROM node:12
WORKDIR /app
COPY package.json .

RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN npm install

COPY . .
CMD ["npm", "run", "start:dev"]
