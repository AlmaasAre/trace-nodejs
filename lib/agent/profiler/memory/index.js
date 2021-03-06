var debug = require('../../../utils/debug')('agent:profiler:memory')
var format = require('util').format
var inherits = require('util').inherits
var Agent = require('../../agent')

var v8profiler = require('../../../optionalDependencies/v8-profiler')

function MemoryProfiler (options) {
  var _this = this
  this.name = 'Profiler/Memory'
  this.collectorApi = options.collectorApi
  this.controlBus = options.controlBus

  this.controlBus.on('memory-heapdump', function (command) {
    _this.sendSnapshot(command)
  })

  Agent.call(this, 'Profiler/Memory')
}

inherits(MemoryProfiler, Agent)

MemoryProfiler.prototype.sendSnapshot = function (command, callback) {
  var _this = this
  var now = Date.now()
  var snapshot = v8profiler.takeSnapshot()

  snapshot && snapshot.export(function (error, result) {
    if (error) {
      return debug.warn('sendSnapshot', format('no profile: %s', error))
    }

    _this.collectorApi.sendMemorySnapshot({
      heapSnapshot: result,
      time: now,
      commandId: command.id
    }, function () {
      snapshot.delete()
    })
  })
}

function create (options) {
  return new MemoryProfiler(options)
}

module.exports.create = create
