// python.monarch.ts
// Auto-generated Monaco language definition
export const pythonLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".python",
  "keywords": [
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "case",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "match",
    "node",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield"
  ],
  "operators": [
    "                            )* /(?![1-9])/\nHEX_NUMBER.2: ",
    "                       )*\n          |   ",
    "                       )*\nDEC_NUMBER:   ",
    "                       )+\n\n_EXP: (",
    "                       )+\nBIN_NUMBER.2: ",
    "             (",
    "        (",
    " (",
    " _SPECIAL_DEC | _SPECIAL_DEC ",
    " _SPECIAL_DEC?\nFLOAT_NUMBER.2: _SPECIAL_DEC _EXP | DECIMAL _EXP?\nIMAG_NUMBER.2: (_SPECIAL_DEC      | FLOAT_NUMBER) (",
    " item)* ",
    " | ",
    "!=",
    "%",
    "%=",
    "&",
    "&=",
    "(",
    "(?!",
    ")",
    ")\n\n\n// Comma-separated list (with an optional trailing comma)\ncs_list{item}: item (",
    ") (",
    ") [",
    "))+\nOCT_NUMBER.2: ",
    ").*?(?<!\\\\)(\\\\\\\\)*?",
    ")/is\n\n_SPECIAL_DEC: ",
    "*",
    "**",
    "**=",
    "*=",
    "+",
    "+=",
    ",",
    "-",
    "-=",
    "->",
    ".",
    ".*?(?<!\\\\)(\\\\\\\\)*?",
    "..",
    "...",
    "/",
    "//",
    "//=",
    "/=",
    ":",
    ":=",
    ";",
    "<",
    "<<",
    "<<=",
    "<=",
    "<>",
    "=",
    "==",
    ">",
    ">=",
    ">>",
    ">>=",
    "?\n_cs_list{item}: item (",
    "?  ",
    "? (",
    "@",
    "@=",
    "[",
    "]",
    "] _SPECIAL_DEC\nDECIMAL: ",
    "^",
    "^=",
    "_",
    "t actually a valid comparison operator in Python. It",
    "{",
    "|",
    "|=",
    "}",
    "~"
  ],
  "symbols": "\\[|\\ \\|\\ |:|>=|<>|\\)\\.\\*\\?\\(\\?<!\\\\\\\\\\)\\(\\\\\\\\\\\\\\\\\\)\\*\\?|\\?\\ \\(|<|\\~|\\+|\\-|%|%=|/=|\\(\\?!|\\^|>>|\\^=|t\\ actually\\ a\\ valid\\ comparison\\ operator\\ in\\ Python\\.\\ It|\\.\\*\\?\\(\\?<!\\\\\\\\\\)\\(\\\\\\\\\\\\\\\\\\)\\*\\?|\\]\\ _SPECIAL_DEC\\\nDECIMAL:\\ |\\-=|<<=|\\?\\ \\ |\\}|\\.\\.|\\)\\)\\+\\\nOCT_NUMBER\\.2:\\ |\\ _SPECIAL_DEC\\?\\\nFLOAT_NUMBER\\.2:\\ _SPECIAL_DEC\\ _EXP\\ \\|\\ DECIMAL\\ _EXP\\?\\\nIMAG_NUMBER\\.2:\\ \\(_SPECIAL_DEC\\ \\ \\ \\ \\ \\ \\|\\ FLOAT_NUMBER\\)\\ \\(|\\||=|\\?\\\n_cs_list\\{item\\}:\\ item\\ \\(|\\)|\\.\\.\\.|>|\\.|\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\ /\\(\\?!\\[1\\-9\\]\\)/\\\nHEX_NUMBER\\.2:\\ |\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\(|:=|\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\+\\\n\\\n_EXP:\\ \\(|\\)\\ \\(|\\]|\\ \\ \\ \\ \\ \\ \\ \\ \\(|<<|\\ _SPECIAL_DEC\\ \\|\\ _SPECIAL_DEC\\ |\\->|\\)\\ \\[|//=|\\{|==|\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\+\\\nBIN_NUMBER\\.2:\\ |\\*\\*|@=|>>=|\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ \\ \\ |\\*=|\\|=|\\)/is\\\n\\\n_SPECIAL_DEC:\\ |\\+=|_|\\(|//|\\&|\\*|\\*\\*=|<=|@|,|!=|;|\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\\nDEC_NUMBER:\\ \\ \\ |\\ \\(|\\&=|\\ item\\)\\*\\ |\\)\\\n\\\n\\\n//\\ Comma\\-separated\\ list\\ \\(with\\ an\\ optional\\ trailing\\ comma\\)\\\ncs_list\\{item\\}:\\ item\\ \\(|/",
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
        "/\\ _SPECIAL_DEC\\?\\\nFLOAT_NUMBER\\.2:\\ _SPECIAL_DEC\\ _EXP\\ \\|\\ DECIMAL\\ _EXP\\?\\\nIMAG_NUMBER\\.2:\\ \\(_SPECIAL_DEC\\ \\ \\ \\ \\ \\ \\|\\ FLOAT_NUMBER\\)\\ \\(/",
        "operator"
      ],
      [
        "/\\)\\\n\\\n\\\n//\\ Comma\\-separated\\ list\\ \\(with\\ an\\ optional\\ trailing\\ comma\\)\\\ncs_list\\{item\\}:\\ item\\ \\(/",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\ /\\(\\?!\\[1\\-9\\]\\)/\\\nHEX_NUMBER\\.2:\\ /",
        "operator"
      ],
      [
        "/t\\ actually\\ a\\ valid\\ comparison\\ operator\\ in\\ Python\\.\\ It/",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\+\\\nBIN_NUMBER\\.2:\\ /",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ \\ \\ /",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\*\\\nDEC_NUMBER:\\ \\ \\ /",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\)\\+\\\n\\\n_EXP:\\ \\(/",
        "operator"
      ],
      [
        "/\\ _SPECIAL_DEC\\ \\|\\ _SPECIAL_DEC\\ /",
        "operator"
      ],
      [
        "/\\]\\ _SPECIAL_DEC\\\nDECIMAL:\\ /",
        "operator"
      ],
      [
        "/\\?\\\n_cs_list\\{item\\}:\\ item\\ \\(/",
        "operator"
      ],
      [
        "/\\)/is\\\n\\\n_SPECIAL_DEC:\\ /",
        "operator"
      ],
      [
        "/\\)\\.\\*\\?\\(\\?<!\\\\\\\\\\)\\(\\\\\\\\\\\\\\\\\\)\\*\\?/",
        "operator"
      ],
      [
        "/\\.\\*\\?\\(\\?<!\\\\\\\\\\)\\(\\\\\\\\\\\\\\\\\\)\\*\\?/",
        "operator"
      ],
      [
        "/\\)\\)\\+\\\nOCT_NUMBER\\.2:\\ /",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\(/",
        "operator"
      ],
      [
        "/\\ \\ \\ \\ \\ \\ \\ \\ \\(/",
        "operator"
      ],
      [
        "/\\ item\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\?\\ \\(/",
        "operator"
      ],
      [
        "/\\(\\?!/",
        "operator"
      ],
      [
        "/<<=/",
        "operator"
      ],
      [
        "/\\?\\ \\ /",
        "operator"
      ],
      [
        "/\\.\\.\\./",
        "operator"
      ],
      [
        "/\\)\\ \\(/",
        "operator"
      ],
      [
        "/\\)\\ \\[/",
        "operator"
      ],
      [
        "///=/",
        "operator"
      ],
      [
        "/>>=/",
        "operator"
      ],
      [
        "/\\*\\*=/",
        "operator"
      ],
      [
        "/>=/",
        "operator"
      ],
      [
        "/<>/",
        "operator"
      ],
      [
        "/%=/",
        "operator"
      ],
      [
        "//=/",
        "operator"
      ],
      [
        "/>>/",
        "operator"
      ],
      [
        "/\\^=/",
        "operator"
      ],
      [
        "/\\-=/",
        "operator"
      ],
      [
        "/\\.\\./",
        "operator"
      ],
      [
        "/:=/",
        "operator"
      ],
      [
        "/<</",
        "operator"
      ],
      [
        "/\\->/",
        "operator"
      ],
      [
        "/==/",
        "operator"
      ],
      [
        "/\\*\\*/",
        "operator"
      ],
      [
        "/@=/",
        "operator"
      ],
      [
        "/\\*=/",
        "operator"
      ],
      [
        "/\\|=/",
        "operator"
      ],
      [
        "/\\+=/",
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
        "/\\ \\(/",
        "operator"
      ],
      [
        "/\\&=/",
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
        "/\\~/",
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
        "/\\^/",
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
        "/_/",
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
        "/@/",
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
export const pythonLanguageConfig = {
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
export function registerPythonLanguage(monaco: any) {
  monaco.languages.register({ id: 'python' });
  monaco.languages.setMonarchTokensProvider('python', pythonLanguage);
  monaco.languages.setLanguageConfiguration('python', pythonLanguageConfig);
}
