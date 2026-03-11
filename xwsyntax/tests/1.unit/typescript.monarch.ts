// typescript.monarch.ts
// Auto-generated Monaco language definition
export const typescriptLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".typescript",
  "keywords": [
    "boolean",
    "function",
    "interface",
    "number",
    "string",
    "type"
  ],
  "operators": [
    "!=",
    "&&",
    "(",
    "(?:[^",
    ")",
    "*",
    "+",
    ",",
    "-",
    "/",
    "/ | /",
    ":",
    ";",
    "<",
    "=",
    "==",
    "===",
    ">",
    "[",
    "[]",
    "\\\\]|\\\\.)*",
    "]",
    "{",
    "||",
    "}"
  ],
  "symbols": "\\[|:|===|<|\\+|\\-|\\\\\\\\\\]\\|\\\\\\\\\\.\\)\\*|\\&\\&|\\}|=|\\)|>|/\\ \\|\\ /|\\]|\\(\\?:\\[\\^|\\|\\||\\{|==|\\(|\\*|,|\\[\\]|!=|;|/",
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
        "/\\\\\\\\\\]\\|\\\\\\\\\\.\\)\\*/",
        "operator"
      ],
      [
        "//\\ \\|\\ //",
        "operator"
      ],
      [
        "/\\(\\?:\\[\\^/",
        "operator"
      ],
      [
        "/===/",
        "operator"
      ],
      [
        "/\\&\\&/",
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
        "/\\[\\]/",
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
        "/\\}/",
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
        "/;/",
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
export const typescriptLanguageConfig = {
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
export function registerTypescriptLanguage(monaco: any) {
  monaco.languages.register({ id: 'typescript' });
  monaco.languages.setMonarchTokensProvider('typescript', typescriptLanguage);
  monaco.languages.setLanguageConfiguration('typescript', typescriptLanguageConfig);
}
