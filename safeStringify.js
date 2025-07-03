/**
 * Safely converts JavaScript values to JSON strings, handling edge cases
 * that would cause native JSON.stringify() to fail or produce unexpected results
 * @param {any} value - The value to convert to a string
 * @returns {string} - A string representation of the value
 */


const safeStringify = (value) => {
    try {

        // Handle special JavaScript types that JSON.stringify() doesn't handle well
        // We check these first before attempting JSON.stringify()
        
        if (value instanceof Date) {
            return value.toISOString()
        } else if (value instanceof RegExp) {
            return value.toString()
        } else if (typeof value === 'function') {
            return value.toString()
        } else if (value === undefined) {
            return 'undefined'
        }

        // For complex objects, we need to prevent circular reference errors
        // WeakSet automatically cleans up when objects are garbage collected

        const seen = new WeakSet()
        return JSON.stringify(value, (key, val) => {

            // Check for circular references
            if (typeof val === 'object' && val !== null) {              
                if (seen.has(val)) {
                    return '[Circular Reference]' // We've seen this object before - it's a circular reference
                }
                seen.add(val)
            }

            // Handle special types that might appear nested within objects

            if (val instanceof Date) {
                return val.toISOString()
            } else if (val instanceof RegExp) {
                return val.toString()
            } else if (typeof val === 'function') {
                return val.toString()
            }

            return val
        })

    } catch (err) {
        // If there's an error, log it and return a string representation of the value
        console.warn(`Error in safeStringify: ${err.message}`)
        return String(value)
    }
}

// We can memoize the function to avoid re-stringifying the same value multiple times
// This is useful for performance optimization and to avoid unnecessary computations

const stringifyCache = new Map()
    const memoizedStringify = (value) => {
        // If the value is not in the cache, stringify it and add it to the cache
        if (!stringifyCache.has(value)) {
            stringifyCache.set(value, safeStringify(value))
        }
        return stringifyCache.get(value) // Return the cached stringified value
    }

module.exports = {safeStringify}