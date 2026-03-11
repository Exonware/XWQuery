// logql.monarch.ts
// Auto-generated Monaco language definition
export const logqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".logql",
  "keywords": [
    "and",
    "avg",
    "d",
    "false",
    "h",
    "json",
    "m",
    "max",
    "min",
    "or",
    "rate",
    "s",
    "sum",
    "true",
    "w"
  ],
  "operators": [
    "!=",
    "!~",
    "(",
    ")",
    ",",
    ".",
    "/ | /",
    "<",
    "<=",
    "=",
    "==",
    "=~",
    ">",
    ">=",
    "[",
    "[^",
    "]",
    "]*",
    "count_over_time",
    "{",
    "|",
    "|=",
    "|~",
    "}"
  ],
  "symbols": "\\[|>=|!\\~|<|=\\~|\\}|\\||=|\\)|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|\\{|==|\\|=|\\[\\^|\\(|count_over_time|<=|!=|,|\\|\\~",
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
        "/count_over_time/",
        "operator"
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
        "/!\\~/",
        "operator"
      ],
      [
        "/=\\~/",
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
        "/\\|=/",
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
        "/\\|\\~/",
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
        "/\\}/",
        "operator"
      ],
      [
        "/\\|/",
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
        "/\\{/",
        "operator"
      ],
      [
        "/\\(/",
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
export const logqlLanguageConfig = {
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
export function registerLogqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'logql' });
  monaco.languages.setMonarchTokensProvider('logql', logqlLanguage);
  monaco.languages.setLanguageConfiguration('logql', logqlLanguageConfig);
}
