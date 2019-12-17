var compareVersions = function (v1, comparator, v2) {
  comparator = comparator == '=' ? '==' : comparator

  var v1parts = v1.split('.'), v2parts = v2.split('.')
  var maxLen = Math.max(v1parts.length, v2parts.length)
  var part1, part2
  var cmp = 0

  for (var i = 0; i < maxLen && !cmp; i++) {
    part1 = parseInt(v1parts[i], 10) || 0
    part2 = parseInt(v2parts[i], 10) || 0
    if (part1 < part2)
      cmp = 1
    if (part1 > part2)
      cmp = -1
  }

  return eval('0' + comparator + cmp)
}

var mainClass = function (node, bestBlock) {
  if (!node.active)
    return 'text-gray'

  if (node.peers === 0)
    return 'text-danger'

  return peerClass(node.peers, node.active)
}

var peerClass = function (peers, active) {
  if (!active)
    return 'text-gray'

  return (peers <= 1 ? 'text-danger' : (peers > 1 && peers < 4 ? 'text-warning' : 'text-success'))
}

var timeClass = function(timestamp) {
  var diff = ((new Date()).getTime() - timestamp) / 1000

  return blockTimeClass(diff)
}

var blockTimeClass = function (diff) {
  if (diff <= 13)
    return 'text-success'

  if (diff <= 20)
    return 'text-warning'

  if (diff <= 30)
    return 'text-orange'

  return 'text-danger'
}

angular.peerClass = peerClass
angular.blockTimeClass = blockTimeClass
angular.mainClass = mainClass
angular.timeClass = timeClass
angular.compareVersions = compareVersions
