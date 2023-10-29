FROM node:18-alpine

WORKDIR /app

COPY package.json /app

RUN yarn --save 

COPY . .

RUN yarn prisma generate
RUN yarn build

RUN chmod +x ./entrypoint.sh

CMD [ "sh", "./entrypoint.sh"]