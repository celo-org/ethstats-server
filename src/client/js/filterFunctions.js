function compareVersions (v1, comparator, v2) {
  comparator = comparator == '=' ? '==' : comparator;

  var v1parts = v1.split('.'), v2parts = v2.split('.');
  var maxLen = Math.max(v1parts.length, v2parts.length);
  var part1, part2;
  var cmp = 0;

  for (var i = 0; i < maxLen && !cmp; i++) {
    part1 = parseInt(v1parts[i], 10) || 0;
    part2 = parseInt(v2parts[i], 10) || 0;
    if (part1 < part2)
      cmp = 1;
    if (part1 > part2)
      cmp = -1;
  }

  return eval('0' + comparator + cmp);
}

function mainClass (node) {
  if (!node.active)
    return 'text-gray';

  if (node.peers === 0)
    return 'text-danger';

  return peerClass(node.peers, node.active);
}

function peerClass (peers, active) {
  if (!active)
    return 'text-gray';

  return (peers <= 1 ? 'text-danger' : (peers > 1 && peers < 4 ? 'text-warning' : 'text-success'));
}

function timeClass (timestamp) {
  var diff = ((new Date()).getTime() - timestamp) / 1000;

  return blockTimeClass(diff);
}

function blockTimeClass (diff) {
  if (diff <= 13)
    return 'text-success';

  if (diff <= 20)
    return 'text-warning';

  if (diff <= 30)
    return 'text-orange';

  return 'text-danger';
}

function latencyFilter (node) {
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
function xssFilter (obj) {
  if (_.isArray(obj)) {
    return _.map(obj, xssFilter);
  } else if (_.isObject(obj)) {
    return _.mapValues(obj, xssFilter);
  } else if (_.isString(obj)) {
    return obj
      .replace(/< *\/* *script *>*/gi, '')
      .replace(/javascript/gi, '');
  } else
    return obj;
}

angular.latencyFilter = latencyFilter;
angular.xssFilter = xssFilter;
angular.peerClass = peerClass;
angular.blockTimeClass = blockTimeClass;
angular.mainClass = mainClass;
angular.timeClass = timeClass;
angular.compareVersions = compareVersions;
