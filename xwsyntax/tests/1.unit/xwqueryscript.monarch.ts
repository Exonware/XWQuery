// xwqueryscript.monarch.ts
// Auto-generated Monaco language definition
export const xwqueryscriptLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".xwqueryscript",
  "keywords": [
    "ADD",
    "ALTER",
    "AND",
    "AS",
    "ASC",
    "AVG",
    "BETWEEN",
    "BOOL",
    "BOOLEAN",
    "BY",
    "COLLECTION",
    "COLUMN",
    "COUNT",
    "CREATE",
    "CROSS",
    "DATABASE",
    "DATE",
    "DATETIME",
    "DECIMAL",
    "DELETE",
    "DESC",
    "DESCRIBE",
    "DISTINCT",
    "DOUBLE",
    "DROP",
    "EXISTS",
    "FALSE",
    "FLOAT",
    "FROM",
    "FULL",
    "GROUP",
    "HAS",
    "HAVING",
    "IF",
    "IN",
    "INDEX",
    "INNER",
    "INSERT",
    "INT",
    "INTEGER",
    "INTO",
    "JOIN",
    "JSON",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LOAD",
    "MATCH",
    "MAX",
    "MERGE",
    "MIN",
    "MODIFY",
    "NOT",
    "NULL",
    "OFFSET",
    "ON",
    "OR",
    "ORDER",
    "OVER",
    "PARTITION",
    "RETURN",
    "RIGHT",
    "SELECT",
    "SET",
    "STORE",
    "SUM",
    "TABLE",
    "TEXT",
    "TIMESTAMP",
    "TO",
    "TRUE",
    "UPDATE",
    "USING",
    "VALUES",
    "VARCHAR",
    "VIEW",
    "WHERE",
    "WINDOW",
    "WITH"
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
    "}"
  ],
  "symbols": "\\[|:|<>|>=|<|\\-|\\+|%|\\}|=|\\)|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|\\->|\\{|\\[\\^|\\(|\\*|<\\-|<=|,|!=|/",
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
export const xwqueryscriptLanguageConfig = {
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
export function registerXwqueryscriptLanguage(monaco: any) {
  monaco.languages.register({ id: 'xwqueryscript' });
  monaco.languages.setMonarchTokensProvider('xwqueryscript', xwqueryscriptLanguage);
  monaco.languages.setLanguageConfiguration('xwqueryscript', xwqueryscriptLanguageConfig);
}
