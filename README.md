# VX

> A powerful collection of JavaScript utilities for safe data handling, intelligent parsing, and pattern matching.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v12%2B-green.svg)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## ✨ Features

- **🛡️ Safe Stringification** - Convert any JavaScript value to string without crashes
- **🧠 Smart Content Parsing** - Intelligent content parsing with customizable rules
- **🔍 Quick Pattern Matching** - Search multiple regex patterns simultaneously  
- **⚡ Performance Optimized** - Built-in memoization and efficient algorithms
- **🔄 Circular Reference Handling** - Safely handle complex object structures
- **📦 Zero Dependencies** - Lightweight and self-contained

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/z3r0dayexplo1t/VX.git
cd VX

# Or download individual files
wget https://raw.githubusercontent.com/z3r0dayexplo1t/VX/main/safeStringify.js
wget https://raw.githubusercontent.com/z3r0dayexplo1t/VX/main/smartParse.js
wget https://raw.githubusercontent.com/z3r0dayexplo1t/VX/main/quickFind.js
```

## 📖 Usage

### SafeStringify

Convert any JavaScript value to a string safely, handling edge cases that would crash `JSON.stringify()`.

```javascript
const { safeStringify } = require('./safeStringify.js');

// Handle circular references
const obj = { name: 'John' };
obj.self = obj;
console.log(safeStringify(obj)); // Won't crash!

// Handle special types
const complexData = {
  date: new Date(),
  regex: /test/g,
  func: () => console.log('hello'),
  undef: undefined
};
console.log(safeStringify(complexData));
```

### SmartParse

Intelligently parse response content with customizable rules and type-specific handling.

```javascript
const { parseContent } = require('./smartParse.js');

// Basic usage
const response = {
  type: 'json',
  body: '{"name": "John", "timestamp": "2023-01-01T00:00:00Z"}'
};

const result = parseContent(response);
console.log(result); // Parsed JSON object

// With custom parsers
const customParsers = {
  json: {
    rule: (content) => content.includes('timestamp'),
    parse: (content) => {
      const parsed = JSON.parse(content);
      parsed.timestamp = new Date(parsed.timestamp);
      return parsed;
    }
  }
};

const enhancedResult = parseContent(response, customParsers);

// With callback
parseContent(response, customParsers, (result) => {
  console.log('Parsed with callback:', result);
});
```

### QuickFind

Search for multiple regex patterns in content simultaneously.

```javascript
const { quickFind } = require('./quickFind.js');

const content = "Contact: john@example.com or call 555-123-4567";
const patterns = {
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phones: /\b\d{3}-\d{3}-\d{4}\b/g
};

const results = quickFind(content, patterns);
console.log(JSON.parse(results));
/* Output:
{
  results: {
    emails: [{ index: 9, value: "john@example.com", pattern: "emails" }],
    phones: [{ index: 30, value: "555-123-4567", pattern: "phones" }]
  },
  stats: null
}
*/
```

## 📚 API Reference

### `safeStringify(value)`

Safely converts any JavaScript value to a JSON string.

**Parameters:**
- `value` (any): The value to stringify

**Returns:** `string` - JSON string representation

**Features:**
- ✅ Handles circular references
- ✅ Preserves Date objects as ISO strings
- ✅ Converts RegExp to string representation
- ✅ Preserves function definitions
- ✅ Handles `undefined` values
- ✅ Never throws errors

### `parseContent(response, parsers, callback)`

Intelligently parse response content with customizable rules.

**Parameters:**
- `response` (object): Response object with `type` and `body` properties
  - `type` (string): Content type ('json', 'html', 'text')
  - `body` (string|any): Content to parse
- `parsers` (object, optional): Custom parsers by content type
- `callback` (function, optional): Callback function `(result, error) => {}`

**Returns:** `any` - Parsed content

**Parser Object Structure:**
```javascript
{
  json: [
    {
      rule: (content) => boolean,  // Condition to apply this parser
      parse: (content) => any      // Parsing function
    }
  ]
}

// Or simplified function format
{
  json: (content) => parsedContent
}
```

**Features:**
- ✅ Type-based parsing (JSON, HTML, text)
- ✅ Custom parsing rules with conditions
- ✅ Chain multiple parsers with arrays
- ✅ Graceful error handling
- ✅ Priority system (custom parsers override defaults)

### `quickFind(content, patterns, options, callback)`

Search content for multiple regex patterns.

**Parameters:**
- `content` (string|any): Content to search in
- `patterns` (object): Object with pattern names as keys and RegExp/strings as values
- `options` (object, optional): Configuration options
  - `maxMatches` (number): Maximum matches per pattern (default: 1000)
- `callback` (function, optional): Callback function for async-style usage

**Returns:** `string` - JSON string with results and stats

## 🔧 Advanced Usage

### Smart Parsing with Complex Rules

```javascript
const { parseContent } = require('./smartParse.js');

// API response with multiple data types
const apiResponse = {
  type: 'json',
  body: JSON.stringify({
    user: { id: 1, name: 'John' },
    createdAt: '2023-01-01T00:00:00Z',
    settings: '{"theme":"dark","notifications":true}'
  })
};

const advancedParsers = {
  json: [
    {
      // Parse nested JSON strings
      rule: (content) => content.includes('settings'),
      parse: (content) => {
        const parsed = JSON.parse(content);
        if (parsed.settings && typeof parsed.settings === 'string') {
          parsed.settings = JSON.parse(parsed.settings);
        }
        return parsed;
      }
    },
    {
      // Convert ISO date strings to Date objects
      rule: (content) => content.includes('createdAt'),
      parse: (content) => {
        const parsed = JSON.parse(content);
        if (parsed.createdAt) {
          parsed.createdAt = new Date(parsed.createdAt);
        }
        return parsed;
      }
    }
  ]
};

const result = parseContent(apiResponse, advancedParsers);
```

### Chained Parsing Operations

```javascript
// Array of parsing functions for sequential processing
const chainedParsers = {
  json: [
    (content) => JSON.parse(content),
    (parsed) => {
      // Convert all date strings
      Object.keys(parsed).forEach(key => {
        if (typeof parsed[key] === 'string' && /\d{4}-\d{2}-\d{2}T/.test(parsed[key])) {
          parsed[key] = new Date(parsed[key]);
        }
      });
      return parsed;
    },
    (parsed) => {
      // Add computed fields
      parsed._processedAt = new Date();
      return parsed;
    }
  ]
};
```

### HTML Content Parsing

```javascript
const htmlResponse = {
  type: 'html',
  body: '<div class="user-card"><h2>John Doe</h2><p>john@example.com</p></div>'
};

const htmlParsers = {
  html: {
    rule: (content) => content.includes('user-card'),
    parse: (content) => {
      // Simple text extraction (in real apps, you'd use a proper HTML parser)
      const nameMatch = content.match(/<h2>(.*?)<\/h2>/);
      const emailMatch = content.match(/<p>(.*?)<\/p>/);
      
      return {
        name: nameMatch ? nameMatch[1] : null,
        email: emailMatch ? emailMatch[1] : null
      };
    }
  }
};

const userData = parseContent(htmlResponse, htmlParsers);
```

### Complex Pattern Matching

```javascript
const patterns = {
  // Email validation
  emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Phone numbers (US format)
  phones: /\b(?:\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  
  // URLs
  urls: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
  
  // Credit card numbers
  creditCards: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  
  // Dates in various formats
  dates: /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g
};

const text = "Visit https://example.com or email support@example.com. Call 555-123-4567 or visit on 12/25/2023";
const results = quickFind(text, patterns, { maxMatches: 100 });
```



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Fix known bugs in quickFind.js
- [ ] Add TypeScript definitions
- [ ] Add more comprehensive test suite
- [ ] Performance benchmarks
- [ ] Browser compatibility testing
- [ ] HTML parsing utilities for smartParse
- [ ] XML/CSV parsing support
- [ ] Stream processing capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the JavaScript community
- Inspired by the need for robust data handling utilities
- Thanks to all contributors and users

---

**Made with ❤️ by [Your Name]**

> If you find this project useful, please consider giving it a ⭐ on GitHub!