// graphql.monarch.ts
// Auto-generated Monaco language definition
export const graphqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".graphql",
  "keywords": [
    "false",
    "fragment",
    "mutation",
    "null",
    "on",
    "query",
    "subscription",
    "true"
  ],
  "operators": [
    "!",
    "$",
    "(",
    ")",
    ",",
    "...",
    ":",
    "=",
    "@",
    "[",
    "[^",
    "]",
    "{",
    "}"
  ],
  "symbols": "\\[|\\]|\\[\\^|:|\\(|!|\\}|=|,|@|\\)|\\{|\\.\\.\\.|\\$",
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
        "/\\.\\.\\./",
        "operator"
      ],
      [
        "/\\[\\^/",
        "operator"
      ],
      [
        "/\\[/",
        "operator"
      ],
      [
        "/\\]/",
        "operator"
      ],
      [
        "/:/",
        "operator"
      ],
      [
        "/\\(/",
        "operator"
      ],
      [
        "/!/",
        "operator"
      ],
      [
        "/\\}/",
        "operator"
      ],
      [
        "/=/",
        "operator"
      ],
      [
        "/,/",
        "operator"
      ],
      [
        "/@/",
        "operator"
      ],
      [
        "/\\)/",
        "operator"
      ],
      [
        "/\\{/",
        "operator"
      ],
      [
        "/\\$/",
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
export const graphqlLanguageConfig = {
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
    },
    {
      "open": "'",
      "close": "'"
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
    },
    {
      "open": "'",
      "close": "'"
    }
  ]
};
// Register with Monaco Editor
export function registerGraphqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'graphql' });
  monaco.languages.setMonarchTokensProvider('graphql', graphqlLanguage);
  monaco.languages.setLanguageConfiguration('graphql', graphqlLanguageConfig);
}
