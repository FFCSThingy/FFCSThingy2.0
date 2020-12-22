FROM node:12

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

CMD [ "npm", "start" ]

# To Run:
# docker image build -t ffcsthingy-backend:1.0 . 
# docker container run --publish 3001:3001 ffcsthingy-backend:1.0