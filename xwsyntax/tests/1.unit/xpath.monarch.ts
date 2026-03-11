// xpath.monarch.ts
// Auto-generated Monaco language definition
export const xpathLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".xpath",
  "keywords": [
    "ancestor",
    "attribute",
    "child",
    "descendant",
    "following",
    "parent",
    "preceding",
    "self"
  ],
  "operators": [
    "!=",
    "*",
    "/",
    "/ | /",
    "//",
    "::",
    "<",
    "<=",
    "=",
    ">",
    ">=",
    "@",
    "[",
    "[^",
    "]",
    "]*"
  ],
  "symbols": "\\[|\\]|\\[\\^|>=|\\]\\*|//|\\*|<|<=|=|@|!=|::|>|/\\ \\|\\ /|/",
  "brackets": [
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
        "/\\[\\^/",
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
        "////",
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
        "/::/",
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
        "/\\*/",
        "operator"
      ],
      [
        "/</",
        "operator"
      ],
      [
        "/=/",
        "operator"
      ],
      [
        "/@/",
        "operator"
      ],
      [
        "/>/",
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
export const xpathLanguageConfig = {
  "brackets": [
    [
      "[",
      "]"
    ]
  ],
  "autoClosingPairs": [
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
export function registerXpathLanguage(monaco: any) {
  monaco.languages.register({ id: 'xpath' });
  monaco.languages.setMonarchTokensProvider('xpath', xpathLanguage);
  monaco.languages.setLanguageConfiguration('xpath', xpathLanguageConfig);
}
