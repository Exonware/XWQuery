// eql.monarch.ts
// Auto-generated Monaco language definition
export const eqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".eql",
  "keywords": [
    "and",
    "by",
    "cidrMatch",
    "concat",
    "d",
    "endsWith",
    "false",
    "h",
    "in",
    "indexOf",
    "length",
    "like",
    "m",
    "maxspan",
    "not",
    "null",
    "number",
    "or",
    "regex",
    "s",
    "sequence",
    "startsWith",
    "stringContains",
    "substring",
    "true",
    "until",
    "where",
    "wildcard",
    "with"
  ],
  "operators": [
    "!=",
    "%",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    "/ | /",
    "<",
    "<=",
    "=",
    "==",
    ">",
    ">=",
    "[",
    "[^",
    "]",
    "]*"
  ],
  "symbols": "\\[|>=|<|\\+|\\-|%|=|\\)|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|==|\\[\\^|\\(|\\*|<=|,|!=|/",
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
        "/\\]\\*/",
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
        "/=/",
        "operator"
      ],
      [
        "/\\)/",
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
        "/\\*/",
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
export const eqlLanguageConfig = {
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
export function registerEqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'eql' });
  monaco.languages.setMonarchTokensProvider('eql', eqlLanguage);
  monaco.languages.setLanguageConfiguration('eql', eqlLanguageConfig);
}
