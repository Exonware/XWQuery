// kotlin.monarch.ts
// Auto-generated Monaco language definition
export const kotlinLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".kotlin",
  "keywords": [
    "Boolean",
    "Double",
    "Int",
    "String",
    "arrayOf",
    "class",
    "fun",
    "val"
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
    ":",
    ";",
    "<",
    "=",
    "==",
    ">",
    "?",
    "[",
    "]",
    "{",
    "||",
    "}"
  ],
  "symbols": "\\[|:|<|\\+|\\-|\\&\\&|\\}|=|\\)|>|\\]|\\(\\?:\\[\\^|\\|\\||\\{|==|\\(|\\?|\\*|,|!=|;|/",
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
        "/\\(\\?:\\[\\^/",
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
export const kotlinLanguageConfig = {
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
export function registerKotlinLanguage(monaco: any) {
  monaco.languages.register({ id: 'kotlin' });
  monaco.languages.setMonarchTokensProvider('kotlin', kotlinLanguage);
  monaco.languages.setLanguageConfiguration('kotlin', kotlinLanguageConfig);
}
