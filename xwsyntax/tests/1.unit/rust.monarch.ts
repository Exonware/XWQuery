// rust.monarch.ts
// Auto-generated Monaco language definition
export const rustLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".rust",
  "keywords": [
    "as",
    "const",
    "else",
    "enum",
    "false",
    "fn",
    "if",
    "let",
    "mod",
    "mut",
    "pub",
    "return",
    "struct",
    "true",
    "use"
  ],
  "operators": [
    " /([^",
    "!=",
    "%",
    "&",
    "&&",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    "->",
    ".",
    "/",
    ":",
    "::",
    ";",
    "<",
    "<=",
    "=",
    "==",
    ">",
    ">=",
    "[",
    "\\",
    "\\/bfnrt]|u[0-9a-fA-F]{4}))*/ ",
    "]",
    "{",
    "||",
    "}"
  ],
  "symbols": "\\[|:|>=|<|\\+|\\-|%|\\&\\&|\\}|=|\\)|\\\\/bfnrt\\]\\|u\\[0\\-9a\\-fA\\-F\\]\\{4\\}\\)\\)\\*/\\ |>|\\.|\\ /\\(\\[\\^|\\]|\\->|\\|\\||\\{|==|::|\\(|\\&|\\*|<=|,|!=|\\\\|;|/",
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
        "/\\\\/bfnrt\\]\\|u\\[0\\-9a\\-fA\\-F\\]\\{4\\}\\)\\)\\*/\\ /",
        "operator"
      ],
      [
        "/\\ /\\(\\[\\^/",
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
        "/\\->/",
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
        "/::/",
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
        "/\\&/",
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
        "/\\\\/",
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
export const rustLanguageConfig = {
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
export function registerRustLanguage(monaco: any) {
  monaco.languages.register({ id: 'rust' });
  monaco.languages.setMonarchTokensProvider('rust', rustLanguage);
  monaco.languages.setLanguageConfiguration('rust', rustLanguageConfig);
}
