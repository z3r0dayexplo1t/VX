function parseContent(response, parsers = {}, callback = null) {
    if (!response) throw new Error('Response is required');

    // get content based on response type 
    let content = null
    const type = response.type || 'text'

    try {
        if (type === 'json') {
            content = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        } else if (type === 'html') {
            content = response.body
        } else {
            content = response.body
        }
    } catch (err) {
        const error = new Error('Failed to parse content: ' + err.message)
        if(callback && typeof callback === 'function') {
            callback(null, error)
        }
        throw error
    }

    // set up the default parsers 
    const defaultParsers = {
        json: [{ rule: () => true, parse: (content) => JSON.parse(content) }],
        html: [{ rule: () => true, parse: (content) => content }],
        text: [{ rule: () => true, parse: (content) => content }],
    }


    // create a deep copy of the default parsers to avoid mutating the original object
    const mergedParsers = { ...defaultParsers }

    // merge custom parsers with default by type
    Object.keys(parsers).forEach(type => {
        if (!mergedParsers[type]) {
            mergedParsers[type] = []
        }

        if (Array.isArray(parsers[type])) {
            mergedParsers[type].unshift(...parsers[type])
        } else if (typeof parsers[type] === 'function') {
            mergedParsers[type].unshift({ rule: () => true, parse: parsers[type] })
        }
    })

    const typeRules = mergedParsers[type] || []
    if (typeRules.length === 0) {
        if(callback && typeof callback === 'function') {
            callback(content)
        }
        return content
    }

    let result = content
    let processed = false

    for (const ruleObj of typeRules) {
        try {
            const { rule, parse } = ruleObj
            if (rule(content)) {
                if (Array.isArray(parse)) {
                    result = parse.reduce((currentContent, parser) => {
                        return parser(currentContent)
                    }, content)
                } else {
                    result = parse(content)
                }
                processed = true
                break
            }
        } catch (err) {
            console.warn('Failed to parse content: ' + err.message)
        }
    }

    // If no rules matched or all failed, return original content
    if (!processed) {
        result = content
    }
    
    // Execute callback if provided
    if(callback && typeof callback === 'function') {
        callback(result)
    }
    
    return result
}

module.exports = {parseContent}