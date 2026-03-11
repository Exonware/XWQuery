// json_query.monarch.ts
// Auto-generated Monaco language definition
export const json_queryLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".json_query",
  "keywords": [
    "false",
    "keys",
    "length",
    "null",
    "size",
    "true",
    "type",
    "values"
  ],
  "operators": [
    "!",
    "!=",
    "$",
    "%",
    "&&",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "..",
    "/",
    "/ | /",
    ":",
    "<",
    "<=",
    "==",
    ">",
    ">=",
    "?",
    "@",
    "[",
    "[^",
    "]",
    "]*",
    "||"
  ],
  "symbols": "\\[|:|>=|<|\\+|\\-|%|\\&\\&|!|\\.\\.|\\)|\\$|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|\\|\\||==|\\[\\^|\\(|\\?|\\*|<=|@|!=|,|/",
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
        "//\\ \\|\\ //",
        "operator"
      ],
      [
        "/>=/",
        "operator"
      ],
      [
        "/\\&\\&/",
        "operator"
      ],
      [
        "/\\.\\./",
        "operator"
      ],
      [
        "/\\]\\*/",
        "operator"
      ],
      [
        "/\\|\\|/",
        "operator"
      ],
      [
        "/==/",
        "operator"
      ],
      [
        "/\\[\\^/",
        "operator"
      ],
      [
        "/<=/",
        "operator"
      ],
      [
        "/!=/",
        "operator"
      ],
      [
        "/\\[/",
        "operator"
      ],
      [
        "/:/",
        "operator"
      ],
      [
        "/</",
        "operator"
      ],
      [
        "/\\+/",
        "operator"
      ],
      [
        "/\\-/",
        "operator"
      ],
      [
        "/%/",
        "operator"
      ],
      [
        "/!/",
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
        "/>/",
        "operator"
      ],
      [
        "/\\./",
        "operator"
      ],
      [
        "/\\]/",
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
        "/@/",
        "operator"
      ],
      [
        "/,/",
        "operator"
      ],
      [
        "///",
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
export const json_queryLanguageConfig = {
  "brackets": [
    [
      "(",
      ")"
    ],
    [
      "[",
      "]"
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
      "open": "'",
      "close": "'"
    }
  ]
};
// Register with Monaco Editor
export function registerJson_queryLanguage(monaco: any) {
  monaco.languages.register({ id: 'json_query' });
  monaco.languages.setMonarchTokensProvider('json_query', json_queryLanguage);
  monaco.languages.setLanguageConfiguration('json_query', json_queryLanguageConfig);
}
