FROM node:10

ADD . /celostats-server
WORKDIR /celostats-server

ENV NODE_ENV=production

RUN npm install
RUN npm install -g grunt-cli
RUN sed -i "s#networkName =.*#networkName = '${NETWORK_NAME:-Celo}'#g" src/client/js/celoConfig.js
RUN sed -i "s#blockscoutUrl =.*#blockscoutUrl = '${BLOCKSOUT_URL:-https://baklava-blockscout.celo-testnet.org/}'#g" src/client/js/celoConfig.js
RUN grunt --configPath="src/client/js/celoConfig.js"

EXPOSE 3000
CMD ["npm", "start"]

