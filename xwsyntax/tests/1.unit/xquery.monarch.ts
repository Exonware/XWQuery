// xquery.monarch.ts
// Auto-generated Monaco language definition
export const xqueryLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".xquery",
  "keywords": [
    "ancestor",
    "and",
    "ascending",
    "attribute",
    "by",
    "child",
    "comment",
    "declare",
    "descendant",
    "descending",
    "div",
    "element",
    "eq",
    "except",
    "false",
    "following",
    "for",
    "ge",
    "gt",
    "idiv",
    "import",
    "in",
    "intersect",
    "is",
    "le",
    "let",
    "lt",
    "mod",
    "module",
    "namespace",
    "ne",
    "node",
    "or",
    "order",
    "parent",
    "preceding",
    "return",
    "self",
    "text",
    "to",
    "true",
    "union",
    "variable",
    "where"
  ],
  "operators": [
    "!=",
    "$",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    "/",
    "/ | /",
    "//",
    ":",
    "::",
    ":=",
    "<",
    "<=",
    "=",
    ">",
    ">=",
    "@",
    "[",
    "[^",
    "]",
    "]*",
    "ancestor-or-self",
    "descendant-or-self",
    "following-sibling",
    "preceding-sibling",
    "{",
    "}"
  ],
  "symbols": "\\[|:|>=|<|\\+|\\-|\\}|=|\\)|descendant\\-or\\-self|\\$|following\\-sibling|>|/\\ \\|\\ /|:=|\\]|\\]\\*|preceding\\-sibling|\\{|::|ancestor\\-or\\-self|\\[\\^|\\(|//|\\*|<=|!=|,|@|/",
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
        "/descendant\\-or\\-self/",
        "operator"
      ],
      [
        "/following\\-sibling/",
        "operator"
      ],
      [
        "/preceding\\-sibling/",
        "operator"
      ],
      [
        "/ancestor\\-or\\-self/",
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
        "/:=/",
        "operator"
      ],
      [
        "/\\]\\*/",
        "operator"
      ],
      [
        "/::/",
        "operator"
      ],
      [
        "/\\[\\^/",
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
        "/\\$/",
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
        "/@/",
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
export const xqueryLanguageConfig = {
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
export function registerXqueryLanguage(monaco: any) {
  monaco.languages.register({ id: 'xquery' });
  monaco.languages.setMonarchTokensProvider('xquery', xqueryLanguage);
  monaco.languages.setLanguageConfiguration('xquery', xqueryLanguageConfig);
}
