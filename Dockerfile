FROM node

RUN git clone https://github.com/goerli/netstats-server /netstats-server
WORKDIR /netstats-server
RUN npm install
RUN npm install -g grunt-cli
RUN grunt --configPath="src/js/celoConfig.js"

EXPOSE  3000
CMD ["npm", "start"]
