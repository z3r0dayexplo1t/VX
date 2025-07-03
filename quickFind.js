const {safeStringify} = require('./safeStringify.js')


function quickFind(content, patterns = {}, options = {}, callback = null) {
    if (!content) throw new Error('Content is required')

    const opts = {
        maxMatches: 1000,
        ...options 
    }

    let stringContent = typeof content === 'string' ? content : safeStringify(content)

    const results = {}

    const startTime = Date.now()

    for (const [patternName, pattern] of Object.entries(patterns)) {

        const regex = pattern instanceof RegExp ? pattern : 
            typeof pattern === 'string' && pattern.startsWith('/') && /\/[gimuy]*$/.test(pattern)
            ? new RegExp(pattern.slice(1, pattern.lastIndexOf('/')), pattern.slice(pattern.lastIndexOf('/') + 1))
            : new RegExp(pattern, 'g')

        const globalRegEx = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`)


        let matches = []
        let match;
        let count = 0;

        while ((match = globalRegEx.exec(stringContent)) !== null && count < opts.maxMatches) {
            matches.push({
                index: match.index,
                value: match[0],
                pattern: patternName,
            })
            count++
        }

        results[patternName] = matches.length > 0 ? matches : null


    }

    const endTime = Date.now()

    if (callback && typeof callback === 'function') {
        callback(null, results)
    }

    return JSON.stringify({
        results,
        stats: {
            executionTime: endTime - startTime,
            patternsProcessed: Object.keys(patterns).length
        }
    })
}


module.exports = {quickFind}