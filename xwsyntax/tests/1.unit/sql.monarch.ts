// sql.monarch.ts
// Auto-generated Monaco language definition
export const sqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".sql",
  "ignoreCase": true,
  "keywords": [
    "ALL",
    "BLOB",
    "BOOL",
    "BOOLEAN",
    "CHAR",
    "CROSS",
    "DATE",
    "DATETIME",
    "DECIMAL",
    "DISTINCT",
    "DOUBLE",
    "FLOAT",
    "FULL",
    "INNER",
    "INT",
    "INTEGER",
    "LEFT",
    "NUMERIC",
    "RIGHT",
    "TEXT",
    "TIME",
    "TIMESTAMP",
    "TOP",
    "VARCHAR"
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
    "/\n\n// Keywords (case-insensitive)\nSELECT: ",
    "<",
    "<=",
    "<>",
    "=",
    ">",
    ">=",
    "[^",
    "]+",
    "i\n\n// Terminals\nQUOTED_IDENTIFIER: /`[^`]+`/ | /\\[[^\\]]+\\]/ | /",
    "i\nADD: ",
    "i\nALTER: ",
    "i\nAND: ",
    "i\nAS: ",
    "i\nASC: ",
    "i\nBETWEEN: ",
    "i\nBOOLEAN: ",
    "i\nBY: ",
    "i\nCHECK: ",
    "i\nCOLUMN: ",
    "i\nCREATE: ",
    "i\nDATABASE: ",
    "i\nDELETE: ",
    "i\nDESC: ",
    "i\nDROP: ",
    "i\nFOREIGN_KEY: ",
    "i\nFROM: ",
    "i\nGROUP: ",
    "i\nHAVING: ",
    "i\nIN: ",
    "i\nINDEX: ",
    "i\nINSERT: ",
    "i\nINTO: ",
    "i\nIS: ",
    "i\nJOIN: ",
    "i\nLIKE: ",
    "i\nLIMIT: ",
    "i\nMODIFY: ",
    "i\nNOT: ",
    "i\nNOT_NULL: ",
    "i\nNULL: ",
    "i\nOFFSET: ",
    "i\nON: ",
    "i\nOR: ",
    "i\nORDER: ",
    "i\nPRIMARY_KEY: ",
    "i\nSET: ",
    "i\nTABLE: ",
    "i\nUNIQUE: ",
    "i\nUPDATE: ",
    "i\nVALUES: ",
    "i\nVIEW: ",
    "i\nWHERE: ",
    "i ",
    "i | "
  ],
  "symbols": "<>|>=|i\\\nINSERT:\\ |<|i\\\nOFFSET:\\ |\\+|\\-|%|i\\\nDATABASE:\\ |i\\\nDELETE:\\ |i\\\nHAVING:\\ |i\\\nBY:\\ |i\\\nDESC:\\ |i\\\nDROP:\\ |i\\\nSET:\\ |i\\\nLIKE:\\ |i\\\nNOT_NULL:\\ |i\\\nAND:\\ |i\\\nNOT:\\ |i\\\nUNIQUE:\\ |i\\\nFOREIGN_KEY:\\ |i\\ \\|\\ |=|i\\\nCREATE:\\ |i\\\nJOIN:\\ |\\)|i\\\nADD:\\ |i\\\nGROUP:\\ |i\\\nLIMIT:\\ |>|\\.|i\\\nCHECK:\\ |i\\\nCOLUMN:\\ |i\\\nINDEX:\\ |i\\\nWHERE:\\ |i\\\nMODIFY:\\ |i\\\nASC:\\ |\\]\\+|i\\\nALTER:\\ |i\\\nBETWEEN:\\ |i\\\nINTO:\\ |i\\\nUPDATE:\\ |i\\\nOR:\\ |i\\\nPRIMARY_KEY:\\ |i\\\nTABLE:\\ |i\\\nIN:\\ |i\\\nBOOLEAN:\\ |\\[\\^|i\\\n\\\n//\\ Terminals\\\nQUOTED_IDENTIFIER:\\ /`\\[\\^`\\]\\+`/\\ \\|\\ /\\\\\\[\\[\\^\\\\\\]\\]\\+\\\\\\]/\\ \\|\\ /|i\\\nFROM:\\ |\\(|i\\\nIS:\\ |/\\\n\\\n//\\ Keywords\\ \\(case\\-insensitive\\)\\\nSELECT:\\ |i\\\nORDER:\\ |\\*|i\\ |<=|i\\\nNULL:\\ |,|!=|i\\\nVIEW:\\ |i\\\nON:\\ |i\\\nAS:\\ |i\\\nVALUES:\\ |/",
  "brackets": [
    {
      "open": "(",
      "close": ")",
      "token": "delimiter.parenthesis"
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
        "/i\\\n\\\n//\\ Terminals\\\nQUOTED_IDENTIFIER:\\ /`\\[\\^`\\]\\+`/\\ \\|\\ /\\\\\\[\\[\\^\\\\\\]\\]\\+\\\\\\]/\\ \\|\\ //",
        "operator"
      ],
      [
        "//\\\n\\\n//\\ Keywords\\ \\(case\\-insensitive\\)\\\nSELECT:\\ /",
        "operator"
      ],
      [
        "/i\\\nFOREIGN_KEY:\\ /",
        "operator"
      ],
      [
        "/i\\\nPRIMARY_KEY:\\ /",
        "operator"
      ],
      [
        "/i\\\nDATABASE:\\ /",
        "operator"
      ],
      [
        "/i\\\nNOT_NULL:\\ /",
        "operator"
      ],
      [
        "/i\\\nBETWEEN:\\ /",
        "operator"
      ],
      [
        "/i\\\nBOOLEAN:\\ /",
        "operator"
      ],
      [
        "/i\\\nINSERT:\\ /",
        "operator"
      ],
      [
        "/i\\\nOFFSET:\\ /",
        "operator"
      ],
      [
        "/i\\\nDELETE:\\ /",
        "operator"
      ],
      [
        "/i\\\nHAVING:\\ /",
        "operator"
      ],
      [
        "/i\\\nUNIQUE:\\ /",
        "operator"
      ],
      [
        "/i\\\nCREATE:\\ /",
        "operator"
      ],
      [
        "/i\\\nCOLUMN:\\ /",
        "operator"
      ],
      [
        "/i\\\nMODIFY:\\ /",
        "operator"
      ],
      [
        "/i\\\nUPDATE:\\ /",
        "operator"
      ],
      [
        "/i\\\nVALUES:\\ /",
        "operator"
      ],
      [
        "/i\\\nGROUP:\\ /",
        "operator"
      ],
      [
        "/i\\\nLIMIT:\\ /",
        "operator"
      ],
      [
        "/i\\\nCHECK:\\ /",
        "operator"
      ],
      [
        "/i\\\nINDEX:\\ /",
        "operator"
      ],
      [
        "/i\\\nWHERE:\\ /",
        "operator"
      ],
      [
        "/i\\\nALTER:\\ /",
        "operator"
      ],
      [
        "/i\\\nTABLE:\\ /",
        "operator"
      ],
      [
        "/i\\\nORDER:\\ /",
        "operator"
      ],
      [
        "/i\\\nDESC:\\ /",
        "operator"
      ],
      [
        "/i\\\nDROP:\\ /",
        "operator"
      ],
      [
        "/i\\\nLIKE:\\ /",
        "operator"
      ],
      [
        "/i\\\nJOIN:\\ /",
        "operator"
      ],
      [
        "/i\\\nINTO:\\ /",
        "operator"
      ],
      [
        "/i\\\nFROM:\\ /",
        "operator"
      ],
      [
        "/i\\\nNULL:\\ /",
        "operator"
      ],
      [
        "/i\\\nVIEW:\\ /",
        "operator"
      ],
      [
        "/i\\\nSET:\\ /",
        "operator"
      ],
      [
        "/i\\\nAND:\\ /",
        "operator"
      ],
      [
        "/i\\\nNOT:\\ /",
        "operator"
      ],
      [
        "/i\\\nADD:\\ /",
        "operator"
      ],
      [
        "/i\\\nASC:\\ /",
        "operator"
      ],
      [
        "/i\\\nBY:\\ /",
        "operator"
      ],
      [
        "/i\\\nOR:\\ /",
        "operator"
      ],
      [
        "/i\\\nIN:\\ /",
        "operator"
      ],
      [
        "/i\\\nIS:\\ /",
        "operator"
      ],
      [
        "/i\\\nON:\\ /",
        "operator"
      ],
      [
        "/i\\\nAS:\\ /",
        "operator"
      ],
      [
        "/i\\ \\|\\ /",
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
        "/\\]\\+/",
        "operator"
      ],
      [
        "/\\[\\^/",
        "operator"
      ],
      [
        "/i\\ /",
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
export const sqlLanguageConfig = {
  "brackets": [
    [
      "(",
      ")"
    ]
  ],
  "autoClosingPairs": [
    {
      "open": "(",
      "close": ")"
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
      "open": "'",
      "close": "'"
    }
  ]
};
// Register with Monaco Editor
export function registerSqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'sql' });
  monaco.languages.setMonarchTokensProvider('sql', sqlLanguage);
  monaco.languages.setLanguageConfiguration('sql', sqlLanguageConfig);
}
