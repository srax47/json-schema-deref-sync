/**
 * Custom implementation of traverse functionality
 * Recursively traverses an object and allows transformation of its values
 */

/**
 * Main traverse function that returns an object with utility methods
 * @param {Object} obj - The object to traverse
 * @returns {Object} - Object with utility methods for traversal
 */
function traverse(obj) {
  return {
    /**
     * Executes a callback for each node in the object
     * @param {Function} callback - Function to call for each node
     * @returns {Object} - The resulting object after transformations
     */
    forEach: function (callback) {
      const visited = new WeakMap()

      function walker(value, path = []) {
        if (value && typeof value === 'object') {
          // Skip if already visited to prevent infinite recursion
          if (visited.has(value)) {
            return
          }

          // Mark as visited
          visited.set(value, true)

          // Save a copy of the keys to avoid issues if the object is modified during traversal
          const keys = Array.isArray(value) ? [...Array(value.length).keys()] : Object.keys(value)

          for (const key of keys) {
            // Skip if the property was deleted during traversal
            if (value[key] === undefined && !Object.prototype.hasOwnProperty.call(value, key))
              continue

            const newPath = path.concat(key)
            const context = createContext(value, key, newPath, obj)

            // Call the callback for this node
            callback.call(context, value[key])

            // If not stopped and not replaced, continue traversing
            if (!context.stopped && value[key] !== undefined && typeof value[key] === 'object') {
              walker(value[key], newPath)
            }
          }
        }
      }

      walker(obj)
      return obj
    },

    /**
     * Reduces an object to a single value by applying a callback to each node
     * @param {Function} callback - Function to call for each node
     * @param {*} initialValue - Initial value for the accumulator
     * @returns {*} - The final accumulated value
     */
    reduce: function (callback, initialValue) {
      let accumulator = initialValue
      const visited = new WeakMap()

      function walker(value, path = []) {
        if (value && typeof value === 'object') {
          // Skip if already visited to prevent infinite recursion
          if (visited.has(value)) {
            return accumulator
          }

          // Mark as visited
          visited.set(value, true)

          const keys = Array.isArray(value) ? [...Array(value.length).keys()] : Object.keys(value)

          for (const key of keys) {
            const newPath = path.concat(key)
            const context = createContext(value, key, newPath, obj)

            // Call the callback for this node
            accumulator = callback.call(context, accumulator, value[key])

            // Continue traversing if the node is an object
            if (value[key] !== undefined && typeof value[key] === 'object') {
              walker(value[key], newPath)
            }
          }
        }

        return accumulator
      }

      return walker(obj)
    },
  }
}

/**
 * Creates a context object for the callback
 * @param {Object} parent - The parent object
 * @param {String|Number} key - The current key
 * @param {Array} path - The path to the current node
 * @param {Object} root - The root object
 * @returns {Object} - The context object
 */
function createContext(parent, key, path, root) {
  return {
    // Current path as an array
    path: path,

    // Reference to parent object
    parent: parent,

    // Key in the parent
    key: key,

    // Method to update the value
    update: function (value, stop = false) {
      parent[key] = value
      if (stop) {
        this.stopped = true
      }
    },

    // Flag to indicate traversal should stop for this branch
    stopped: false,

    // The full object being traversed
    root: root,
  }
}

module.exports = traverse
