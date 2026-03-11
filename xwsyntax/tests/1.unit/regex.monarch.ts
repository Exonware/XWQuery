// regex.monarch.ts
// Auto-generated Monaco language definition
export const regexLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".regex",
  "operators": [
    "$",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    "?",
    "?!",
    "?:",
    "?<!",
    "?<=",
    "?=",
    "?>",
    "[",
    "\\\\",
    "\\\\B",
    "\\\\b",
    "]",
    "^",
    "{",
    "|",
    "}"
  ],
  "symbols": "\\[|\\-|\\?<=|\\+|\\^|\\?>|\\?=|\\\\\\\\b|\\}|\\||\\?<!|\\)|\\$|\\]|\\\\\\\\B|\\?:|\\{|\\\\\\\\|\\(|\\?|\\*|\\?!|,",
  "brackets": [
    {
      "open": "(",
      "close": ")",
      "token": "delimiter.parenthesis"
    },
    {
      "open": "[",
      "close": "]",
      "token": "delimiter.square"
    },
    {
      "open": "{",
      "close": "}",
      "token": "delimiter.curly"
    }
  ],
  "tokenizer": {
    "root": [
      {
        "include": "@whitespace"
      },
      [
        "/\\d+(\\.\\d+)?([eE][+-]?\\d+)?/",
        "number"
      ],
      [
        "/\"([^\"\\\\]|\\\\.)*\"/",
        "string"
      ],
      [
        "/'([^'\\\\]|\\\\.)*'/",
        "string"
      ],
      [
        "/[a-zA-Z_][\\w]*/",
        {
          "cases": {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [
        "/\\?<=/",
        "operator"
      ],
      [
        "/\\\\\\\\b/",
        "operator"
      ],
      [
        "/\\?<!/",
        "operator"
      ],
      [
        "/\\\\\\\\B/",
        "operator"
      ],
      [
        "/\\?>/",
        "operator"
      ],
      [
        "/\\?=/",
        "operator"
      ],
      [
        "/\\?:/",
        "operator"
      ],
      [
        "/\\\\\\\\/",
        "operator"
      ],
      [
        "/\\?!/",
        "operator"
      ],
      [
        "/\\[/",
        "operator"
      ],
      [
        "/\\-/",
        "operator"
      ],
      [
        "/\\+/",
        "operator"
      ],
      [
        "/\\^/",
        "operator"
      ],
      [
        "/\\}/",
        "operator"
      ],
      [
        "/\\|/",
        "operator"
      ],
      [
        "/\\)/",
        "operator"
      ],
      [
        "/\\$/",
        "operator"
      ],
      [
        "/\\]/",
        "operator"
      ],
      [
        "/\\{/",
        "operator"
      ],
      [
        "/\\(/",
        "operator"
      ],
      [
        "/\\?/",
        "operator"
      ],
      [
        "/\\*/",
        "operator"
      ],
      [
        "/,/",
        "operator"
      ],
      [
        "/[()[\\]{}]/",
        "@brackets"
      ],
      [
        "/[;,.]/",
        "delimiter"
      ]
    ],
    "whitespace": [
      [
        "/[ \\t\\r\\n]+/",
        ""
      ],
      [
        "/--.*$/",
        "comment"
      ],
      [
        "/\\/\\/.*$/",
        "comment"
      ],
      [
        "/\\/\\*/",
        "comment",
        "@comment"
      ]
    ],
    "comment": [
      [
        "/[^/*]+/",
        "comment"
      ],
      [
        "/\\*\\//",
        "comment",
        "@pop"
      ],
      [
        "/[/*]/",
        "comment"
      ]
    ]
  }
};
export const regexLanguageConfig = {
  "brackets": [
    [
      "(",
      ")"
    ],
    [
      "[",
      "]"
    ],
    [
      "{",
      "}"
    ]
  ],
  "autoClosingPairs": [
    {
      "open": "(",
      "close": ")"
    },
    {
      "open": "[",
      "close": "]"
    },
    {
      "open": "{",
      "close": "}"
    }
  ],
  "surroundingPairs": [
    {
      "open": "(",
      "close": ")"
    },
    {
      "open": "[",
      "close": "]"
    },
    {
      "open": "{",
      "close": "}"
    }
  ]
};
// Register with Monaco Editor
export function registerRegexLanguage(monaco: any) {
  monaco.languages.register({ id: 'regex' });
  monaco.languages.setMonarchTokensProvider('regex', regexLanguage);
  monaco.languages.setLanguageConfiguration('regex', regexLanguageConfig);
}
