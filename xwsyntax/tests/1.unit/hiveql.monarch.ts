// hiveql.monarch.ts
// Auto-generated Monaco language definition
export const hiveqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".hiveql",
  "keywords": [
    "ADD",
    "ALTER",
    "AND",
    "ARRAY",
    "AS",
    "ASC",
    "AVG",
    "AVRO",
    "BETWEEN",
    "BIGINT",
    "BINARY",
    "BOOL",
    "BOOLEAN",
    "BUCKET",
    "BY",
    "CHAR",
    "CLUSTER",
    "COLUMNS",
    "COMMENT",
    "COUNT",
    "CREATE",
    "CROSS",
    "DATA",
    "DATE",
    "DECIMAL",
    "DELIMITED",
    "DESC",
    "DISTINCT",
    "DISTRIBUTE",
    "DOUBLE",
    "DROP",
    "EXISTS",
    "FALSE",
    "FIELDS",
    "FLOAT",
    "FORMAT",
    "FROM",
    "FULL",
    "GROUP",
    "HAVING",
    "IF",
    "IN",
    "INNER",
    "INPATH",
    "INSERT",
    "INT",
    "INTEGER",
    "INTO",
    "JOIN",
    "LEFT",
    "LIKE",
    "LIMIT",
    "LINES",
    "LOAD",
    "LOCAL",
    "LOCATION",
    "MAP",
    "MAX",
    "MIN",
    "NOT",
    "NULL",
    "OF",
    "ON",
    "OR",
    "ORC",
    "ORDER",
    "OUT",
    "OUTER",
    "OVERWRITE",
    "PARQUET",
    "PARTITION",
    "PARTITIONED",
    "RCFILE",
    "RENAME",
    "RIGHT",
    "RLIKE",
    "ROW",
    "SELECT",
    "SEQUENCEFILE",
    "SMALLINT",
    "SORT",
    "STORED",
    "STRING",
    "STRUCT",
    "SUM",
    "TABLE",
    "TABLESAMPLE",
    "TERMINATED",
    "TEXTFILE",
    "TIMESTAMP",
    "TINYINT",
    "TO",
    "TRUE",
    "VALUES",
    "VARCHAR",
    "WHERE",
    "array",
    "map",
    "struct"
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
    ":",
    "<",
    "<=",
    "<>",
    "=",
    ">",
    ">=",
    "DOUBLE PRECISION",
    "[",
    "[^",
    "]",
    "]*",
    "named_struct",
    "{",
    "}"
  ],
  "symbols": "\\[|:|<>|>=|<|\\+|\\-|%|\\}|=|\\)|>|\\.|/\\ \\|\\ /|\\]|\\]\\*|\\{|named_struct|\\[\\^|\\(|\\*|<=|,|!=|DOUBLE\\ PRECISION|/",
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
        "/DOUBLE\\ PRECISION/",
        "operator"
      ],
      [
        "/named_struct/",
        "operator"
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
export const hiveqlLanguageConfig = {
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
export function registerHiveqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'hiveql' });
  monaco.languages.setMonarchTokensProvider('hiveql', hiveqlLanguage);
  monaco.languages.setLanguageConfiguration('hiveql', hiveqlLanguageConfig);
}
