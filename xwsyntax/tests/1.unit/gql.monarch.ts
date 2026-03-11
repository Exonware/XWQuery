// gql.monarch.ts
// Auto-generated Monaco language definition
export const gqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".gql",
  "keywords": [
    "AND",
    "AS",
    "DELETE",
    "DETACH",
    "FALSE",
    "IN",
    "INSERT",
    "IS",
    "MATCH",
    "NOT",
    "NULL",
    "OR",
    "RETURN",
    "SET",
    "TRUE",
    "UPDATE",
    "WHERE"
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
    "->",
    ".",
    "/",
    "/ | /",
    ":",
    "<",
    "<-",
    "<=",
    "<>",
    "=",
    ">",
    ">=",
    "[",
    "[^",
    "]",
    "]*",
    "{",
    "|",
    "}"
  ],
  "symbols": "\\[|:|<>|>=|<|\\-|\\+|%|\\}|\\||=|\\)|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|\\->|\\{|\\[\\^|\\(|\\*|<\\-|<=|,|!=|/",
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
        "//\\ \\|\\ //",
        "operator"
      ],
      [
        "/<>/",
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
        "/\\->/",
        "operator"
      ],
      [
        "/\\[\\^/",
        "operator"
      ],
      [
        "/<\\-/",
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
        "/\\-/",
        "operator"
      ],
      [
        "/\\+/",
        "operator"
      ],
      [
        "/%/",
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
export const gqlLanguageConfig = {
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
export function registerGqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'gql' });
  monaco.languages.setMonarchTokensProvider('gql', gqlLanguage);
  monaco.languages.setLanguageConfiguration('gql', gqlLanguageConfig);
}
