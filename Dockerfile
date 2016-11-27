FROM node:slim

ADD ./package.json /opt/databot/package.json

WORKDIR /opt/databot

RUN npm install

ADD . /opt/databot

EXPOSE 8765

CMD ["npm", "start"]
