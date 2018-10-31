'use strict'

import { isBigNumber, isCollection, isNumber } from '../../utils/is'

const errorTransform = require('./error.transform').transform

/**
 * Attach a transform function to math.mean
 * Adds a property transform containing the transform function.
 *
 * This transform changed the last `dim` parameter of function mean
 * from one-based to zero based
 */
function factory (type, config, load, typed) {
  const mean = load(require('../../function/statistics/mean'))

  return typed('mean', {
    '...any': function (args) {
      // change last argument dim from one-based to zero-based
      if (args.length === 2 && isCollection(args[0])) {
        const dim = args[1]
        if (isNumber(dim)) {
          args[1] = dim - 1
        } else if (isBigNumber(dim)) {
          args[1] = dim.minus(1)
        }
      }

      try {
        return mean.apply(null, args)
      } catch (err) {
        throw errorTransform(err)
      }
    }
  })
}

exports.name = 'mean'
exports.path = 'expression.transform'
exports.factory = factory