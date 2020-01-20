/* Controllers */
netStatsApp.controller('StatsCtrl', function ($scope, $filter, $localStorage, socket, _, toastr) {

  var MAX_BINS = 40;

  // Main Stats init
  // ---------------

  $scope.frontierHash = '0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa';
  $scope.nodesTotal = 0;
  $scope.nodesActive = 0;
  $scope.bestBlock = 0;
  $scope.lastBlock = 0;
  $scope.lastDifficulty = 0;
  $scope.upTimeTotal = 0;
  $scope.avgBlockTime = 0;
  $scope.blockPropagationAvg = 0;
  $scope.avgHashrate = 0;
  $scope.bestStats = {};

  $scope.lastGasLimit = _.fill(Array(MAX_BINS), 2);
  $scope.lastBlocksTime = _.fill(Array(MAX_BINS), 2);
  $scope.difficultyChart = _.fill(Array(MAX_BINS), 2);
  $scope.transactionDensity = _.fill(Array(MAX_BINS), 2);
  $scope.gasSpending = _.fill(Array(MAX_BINS), 2);
  $scope.miners = [];
  $scope.validators = {
    elected: 0,
    registered: 0
  };
  $scope.nodes = [];
  $scope.map = [];
  $scope.blockPropagationChart = [];
  $scope.coinbases = [];
  $scope.latency = 0;
  $scope.currentApiVersion = "0.1.1";
  $scope.predicate = $localStorage.predicate || ['-pinned', '-stats.active', '-stats.block.number', 'stats.block.propagation'];
  $scope.reverse = $localStorage.reverse || false;
  $scope.pinned = $localStorage.pinned || [];
  $scope.prefixPredicate = ['-pinned', '-stats.active'];
  $scope.originalPredicate = ['-stats.block.number', 'stats.block.propagation'];

  $scope.orderTable = function (predicate, reverse) {
    if (!_.isEqual(predicate, $scope.originalPredicate)) {
      $scope.reverse = reverse;
      $scope.originalPredicate = predicate;
      $scope.predicate = _.union($scope.prefixPredicate, predicate);
    } else {
      $scope.reverse = !$scope.reverse;

      if ($scope.reverse === true) {
        _.forEach(predicate, function (value, key) {
          predicate[key] = (value[0] === '-' ? value.replace('-', '') : '-' + value);
        });
      }

      $scope.predicate = _.union($scope.prefixPredicate, predicate);
    }

    $localStorage.predicate = $scope.predicate;
    $localStorage.reverse = $scope.reverse;
  }

  $scope.pinNode = function (id) {
    var index = findIndex({ id: id });
    var node = $scope.nodes[index]

    if (!_.isUndefined(node)) {
      node.pinned = !node.pinned;

      if (node.pinned) {
        $scope.pinned.push(id);
      } else {
        $scope.pinned.splice($scope.pinned.indexOf(id), 1);
      }
    }

    $localStorage.pinned = $scope.pinned;
  }

  // var timeout = setInterval(function () {
  //   $scope.$apply();
  // }, 1000);

  $scope.getNumber = function (num) {
    return new Array(num);
  }

  // Socket listeners
  // ----------------
  socket
    .on('connect', function open () {
      socket.emit('ready');
      console.log('The connection has been opened.');
    })
    .on('end', function end () {
      console.log('Socket connection ended.')
    })
    .on('error', function error (err) {
      console.log(err);
    })
    .on('reconnecting', function reconnecting (opts) {
      console.log('We are scheduling a reconnect operation', opts);
    })
    .on('b', function (data) {
      $scope.$apply(socketAction(data.action, data.data));
    })
    .on('init', function (data) {
      $scope.$apply(socketAction("init", data));
    })
    .on('charts', function (data) {
      $scope.$apply(socketAction("charts", data));
    })
    .on('client-latency', function (data) {
      $scope.latency = data.latency;
    })

  function socketAction(action, data) {
    // filter data
    data = xssFilter(data);

    switch (action) {
      case "init":
        $scope.nodes = data;
        _.forEach($scope.nodes, function (node, index) {

          // Init hashrate
          if (_.isUndefined(node.stats.hashrate))
            node.stats.hashrate = 0;

          // Init latency
          latencyFilter(node);

          // Init history
          if (_.isUndefined(data.history)) {
            data.history = new Array(40);
            _.fill(data.history, -1);
          }

          // Init or recover pin
          node.pinned = ($scope.pinned.indexOf(node.id) >= 0 ? true : false);
        });

        if ($scope.nodes.length > 0) {
          toastr['success']("Got nodes list", "Got nodes!");

          updateActiveNodes();
        }

        break;

      // TODO: Remove when everybody updates api client to 0.0.12
      case "update":
        var index = findIndex({ id: data.id });
        var node = $scope.nodes[index]

        if (
          index >= 0 &&
          !_.isUndefined(node) &&
          !_.isUndefined(node.stats)
        ) {
          if (!_.isUndefined(node.stats.latency))
            data.stats.latency = node.stats.latency;

          if (_.isUndefined(data.stats.hashrate))
            data.stats.hashrate = 0;

          if (node.stats.block.number < data.stats.block.number) {
            var best = _.max($scope.nodes, function (node) {
              return parseInt(node.stats.block.number);
            }).stats.block;

            if (data.stats.block.number > best.number) {
              data.stats.block.arrived = _.now();
            } else {
              data.stats.block.arrived = best.arrived;
            }
            node.history = data.history;
          }

          node.stats = data.stats;

          if (
            !_.isUndefined(data.stats.latency) &&
            _.get(node, 'stats.latency', 0) !== data.stats.latency
          ) {
            node.stats.latency = data.stats.latency;

            latencyFilter(node);
          }

          updateBestBlock();
        }

        break;

      case "block":
        var index = findIndex({ id: data.id });
        var node = $scope.nodes[index];

        if (
          index >= 0 &&
          !_.isUndefined(node) &&
          !_.isUndefined(node.stats)
        ) {
          if (node.stats.block.number < data.block.number) {
            var best = _.max($scope.nodes, function (node) {
              return parseInt(node.stats.block.number);
            }).stats.block;

            if (data.block.number > best.number) {
              data.block.arrived = _.now();
            } else {
              data.block.arrived = best.arrived;
            }

            node.history = data.history;
          }

          node.stats.block = data.block;
          node.stats.propagationAvg = data.propagationAvg;

          if(data.block.validators.elected || data.block.registered) {
            $scope.validators = data.block.validators;
          }

          updateBestBlock();
        }

        break;

      case "pending":
        var index = findIndex({ id: data.id });

        if (
          !_.isUndefined(data.id) &&
          index >= 0
        ) {
          var node = $scope.nodes[index];

          if (
            !_.isUndefined(node) &&
            !_.isUndefined(node.stats.pending) &&
            !_.isUndefined(data.pending)
          )
            node.stats.pending = data.pending;
        }

        break;

      case "stats":
        var index = findIndex({ id: data.id });

        if (!_.isUndefined(data.id) && index >= 0) {
          var node = $scope.nodes[index];

          if (
            !_.isUndefined(node) &&
            !_.isUndefined(node.stats)
          ) {
            node.stats.active = data.stats.active;
            node.stats.mining = data.stats.mining;
            node.stats.hashrate = data.stats.hashrate;
            node.stats.peers = data.stats.peers;
            node.stats.gasPrice = data.stats.gasPrice;
            node.stats.uptime = data.stats.uptime;
            node.stats.address = data.stats.address;

            if (
              !_.isUndefined(data.stats.latency) &&
              _.get(node, 'stats.latency', 0) !== data.stats.latency
            ) {
              node.stats.latency = data.stats.latency;
            }

            latencyFilter(node);
            updateActiveNodes();
          }
        }

        break;

      case "info":
        var index = findIndex({ id: data.id });

        if (index >= 0) {
          var node = $scope.nodes[index]
          node.info = data.info;

          if (_.isUndefined(node.pinned))
            node.pinned = false;

          // Init latency
          latencyFilter(node);

          updateActiveNodes();
        }

        break;

      case "blockPropagationChart":
        $scope.blockPropagationChart = data.histogram;
        $scope.blockPropagationAvg = data.avg;

        break;

      case "charts":
        if (!_.isEqual($scope.avgBlockTime, data.avgBlocktime))
          $scope.avgBlockTime = data.avgBlocktime;

        if (!_.isEqual($scope.avgHashrate, data.avgHashrate))
          $scope.avgHashrate = data.avgHashrate;

        if (!_.isEqual($scope.lastGasLimit, data.gasLimit) && data.gasLimit.length >= MAX_BINS)
          $scope.lastGasLimit = data.gasLimit;

          if (!_.isEqual($scope.lastBlocksTime, data.blocktime) && data.blocktime.length >= MAX_BINS)
          $scope.lastBlocksTime = data.blocktime;

        if (!_.isEqual($scope.difficultyChart, data.difficulty) && data.difficulty.length >= MAX_BINS)
          $scope.difficultyChart = data.difficulty;

        if (!_.isEqual($scope.blockPropagationChart, data.propagation.histogram)) {
          $scope.blockPropagationChart = data.propagation.histogram;
          $scope.blockPropagationAvg = data.propagation.avg;
        }

        if (!_.isEqual($scope.transactionDensity, data.transactions) && data.transactions.length >= MAX_BINS)
          $scope.transactionDensity = data.transactions;

        if (!_.isEqual($scope.gasSpending, data.gasSpending) && data.gasSpending.length >= MAX_BINS)
          $scope.gasSpending = data.gasSpending;

        if (!_.isEqual($scope.miners, data.miners)) {
          $scope.miners = data.miners;
        }

        break;

      case "inactive":
        var index = findIndex({ id: data.id });

        if (index >= 0) {
          var node = $scope.nodes[index]
          if (!_.isUndefined(data.stats))
            node.stats = data.stats;

          latencyFilter(node);
          updateActiveNodes();
        }

        break;

      case "latency":
        if (!_.isUndefined(data.id) && !_.isUndefined(data.latency)) {
          var index = findIndex({ id: data.id });

          if (index >= 0) {
            var node = $scope.nodes[index];

            if (
              !_.isUndefined(node) &&
              !_.isUndefined(node.stats) &&
              !_.isUndefined(node.stats.latency) &&
              node.stats.latency !== data.latency
            ) {
              node.stats.latency = data.latency;
              latencyFilter(node);
            }
          }
        }

        break;

      case "client-ping":
        socket.emit('client-pong', {
          serverTime: data.serverTime,
          clientTime: _.now()
        });

        break;
    }

    // $scope.$apply();
  }

  function findIndex(search) {
    return _.findIndex($scope.nodes, search);
  }

  function updateActiveNodes() {
    updateBestBlock();

    $scope.nodesTotal = $scope.nodes.length;

    $scope.nodesActive = _.filter($scope.nodes, function (node) {
      // forkFilter(node);
      return node.stats.active === true;
    }).length;

    $scope.upTimeTotal = _.reduce($scope.nodes, function (total, node) {
      return total + node.stats.uptime;
    }, 0) / $scope.nodes.length;
  }

  function updateBestBlock() {
    if ($scope.nodes.length) {
      var bestBlock = _.max($scope.nodes, function (node) {
        return parseInt(node.stats.block.number);
      }).stats.block.number;

      if (bestBlock !== $scope.bestBlock) {
        $scope.bestBlock = bestBlock;
        $scope.bestStats = _.max($scope.nodes, function (node) {
          return parseInt(node.stats.block.number);
        }).stats;

        $scope.lastBlock = $scope.bestStats.block.arrived;
        $scope.lastDifficulty = $scope.bestStats.block.difficulty;
      }
    }
  }

  function latencyFilter(node) {
    if (_.isUndefined(node.readable))
      node.readable = {};

    if (_.isUndefined(node.stats)) {
      node.readable.latencyClass = 'text-danger';
      node.readable.latency = 'offline';
    }

    if (node.stats.active === false) {
      node.readable.latencyClass = 'text-danger';
      node.readable.latency = 'offline';
    } else {
      if (node.stats.latency <= 100)
        node.readable.latencyClass = 'text-success';

      if (node.stats.latency > 100 && node.stats.latency <= 1000)
        node.readable.latencyClass = 'text-warning';

      if (node.stats.latency > 1000)
        node.readable.latencyClass = 'text-danger';

      node.readable.latency = node.stats.latency + ' ms';
    }
  }

  // very simple xss filter
  function xssFilter(obj) {
    if (_.isArray(obj)) {
      return _.map(obj, xssFilter);

    } else if (_.isObject(obj)) {
      return _.mapValues(obj, xssFilter);

    } else if (_.isString(obj)) {
      return obj.replace(/\< *\/* *script *>*/gi, '').replace(/javascript/gi, '');
    } else
      return obj;
  }
});