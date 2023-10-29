FROM node:18-alpine


WORKDIR /app

COPY package.json /app

RUN yarn --save 

COPY . .


# TODO: uncommnet this !
RUN yarn build

# use start instead of dev in production
CMD [ "yarn", "start"]