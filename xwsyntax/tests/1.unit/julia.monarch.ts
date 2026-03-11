// julia.monarch.ts
// Auto-generated Monaco language definition
export const juliaLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".julia",
  "keywords": [
    "abstract",
    "begin",
    "catch",
    "const",
    "else",
    "elseif",
    "end",
    "export",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "let",
    "macro",
    "module",
    "mutable",
    "primitive",
    "quote",
    "struct",
    "try",
    "type",
    "where",
    "while"
  ],
  "operators": [
    "\n\n_NEWLINE: /\\r?\\n/\n\nIDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/\nNUMBER: /[0-9]+(\\.[0-9]+)?([eE][+-]?[0-9]+)?/\nSTRING: /",
    "\ndict_literal: ",
    "\nmatrix_literal: ",
    "\npair: expression ",
    "\nstring_interp: STRING | STRING_TRIPLE\n\nliteral: NUMBER | ",
    " (argument_list)? ",
    " (identifier_list ",
    " (pair (",
    " /[\\s\\S]*?/ ",
    " IDENTIFIER | ",
    " expression\ncomprehension: ",
    " expression ",
    " expression (",
    " expression)* ",
    " expression)* (",
    " expression)? ",
    " pair)*)? ",
    " tuple_expr ",
    " type_ref)*\nargument_list: expression (",
    " | ",
    " | identifier_list ",
    " | vector_literal | matrix_literal | dict_literal | comprehension | string_interp\n\nvector_literal: ",
    "!",
    "!=",
    "!==",
    "%",
    "&&",
    "(",
    ")",
    ") expression (",
    ")?\n\nprimary: literal | IDENTIFIER | ",
    "*",
    "*=",
    "+",
    "+=",
    ",",
    "-",
    "-=",
    ".",
    "...",
    "/",
    "/\nSTRING_TRIPLE: ",
    "/=",
    ":",
    "::",
    "<",
    "<:",
    "<=",
    "=",
    "==",
    "===",
    ">",
    ">:",
    ">=",
    "?",
    "\\",
    "\\.*",
    "\\.+",
    "\\.-",
    "\\./",
    "\\\\]*(?:\\\\.[^",
    "{",
    "|>",
    "||",
    "}",
    "~",
    "\u00ac",
    "\u00f7"
  ],
  "symbols": "\\ \\|\\ |\\ expression\\ \\(|:|>=|===|\\ \\(pair\\ \\(|<|\\\\\\.\\-|\\+|\\-|%|\\~|\\ \\(argument_list\\)\\?\\ |/=|\\ expression\\)\\?\\ |\\ expression\\\ncomprehension:\\ |\\\\\\./|\\ /\\[\\\\s\\\\S\\]\\*\\?/\\ |\\|>|\\&\\&|\\-=|!|\\ \\|\\ vector_literal\\ \\|\\ matrix_literal\\ \\|\\ dict_literal\\ \\|\\ comprehension\\ \\|\\ string_interp\\\n\\\nvector_literal:\\ |\\}|\\ expression\\)\\*\\ |\\\npair:\\ expression\\ |\u00ac|=|<:|\\\ndict_literal:\\ |\\)|\\\\\\.\\*|\\.\\.\\.|\\ pair\\)\\*\\)\\?\\ |>|\\.|!==|\\ expression\\)\\*\\ \\(|\\\nstring_interp:\\ STRING\\ \\|\\ STRING_TRIPLE\\\n\\\nliteral:\\ NUMBER\\ \\|\\ |\\|\\||\u00f7|\\ IDENTIFIER\\ \\|\\ |\\{|==|::|\\\\\\\\\\]\\*\\(\\?:\\\\\\\\\\.\\[\\^|\\)\\ expression\\ \\(|/\\\nSTRING_TRIPLE:\\ |\\*=|\\ tuple_expr\\ |\\\n\\\n_NEWLINE:\\ /\\\\r\\?\\\\n/\\\n\\\nIDENTIFIER:\\ /\\[a\\-zA\\-Z_\\]\\[a\\-zA\\-Z0\\-9_\\]\\*/\\\nNUMBER:\\ /\\[0\\-9\\]\\+\\(\\\\\\.\\[0\\-9\\]\\+\\)\\?\\(\\[eE\\]\\[\\+\\-\\]\\?\\[0\\-9\\]\\+\\)\\?/\\\nSTRING:\\ /|\\+=|\\\\\\.\\+|\\(|\\ \\|\\ identifier_list\\ |\\?|\\ type_ref\\)\\*\\\nargument_list:\\ expression\\ \\(|\\*|<=|,|!=|\\\nmatrix_literal:\\ |\\ \\(identifier_list\\ |\\\\|\\ expression\\ |>:|\\)\\?\\\n\\\nprimary:\\ literal\\ \\|\\ IDENTIFIER\\ \\|\\ |/",
  "brackets": [
    {
      "open": "(",
      "close": ")",
      "token": "delimiter.parenthesis"
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
        "/\\\n\\\n_NEWLINE:\\ /\\\\r\\?\\\\n/\\\n\\\nIDENTIFIER:\\ /\\[a\\-zA\\-Z_\\]\\[a\\-zA\\-Z0\\-9_\\]\\*/\\\nNUMBER:\\ /\\[0\\-9\\]\\+\\(\\\\\\.\\[0\\-9\\]\\+\\)\\?\\(\\[eE\\]\\[\\+\\-\\]\\?\\[0\\-9\\]\\+\\)\\?/\\\nSTRING:\\ //",
        "operator"
      ],
      [
        "/\\ \\|\\ vector_literal\\ \\|\\ matrix_literal\\ \\|\\ dict_literal\\ \\|\\ comprehension\\ \\|\\ string_interp\\\n\\\nvector_literal:\\ /",
        "operator"
      ],
      [
        "/\\\nstring_interp:\\ STRING\\ \\|\\ STRING_TRIPLE\\\n\\\nliteral:\\ NUMBER\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ type_ref\\)\\*\\\nargument_list:\\ expression\\ \\(/",
        "operator"
      ],
      [
        "/\\)\\?\\\n\\\nprimary:\\ literal\\ \\|\\ IDENTIFIER\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ expression\\\ncomprehension:\\ /",
        "operator"
      ],
      [
        "/\\ \\|\\ identifier_list\\ /",
        "operator"
      ],
      [
        "/\\ \\(argument_list\\)\\?\\ /",
        "operator"
      ],
      [
        "/\\\npair:\\ expression\\ /",
        "operator"
      ],
      [
        "/\\ \\(identifier_list\\ /",
        "operator"
      ],
      [
        "//\\\nSTRING_TRIPLE:\\ /",
        "operator"
      ],
      [
        "/\\\nmatrix_literal:\\ /",
        "operator"
      ],
      [
        "/\\\ndict_literal:\\ /",
        "operator"
      ],
      [
        "/\\ expression\\)\\*\\ \\(/",
        "operator"
      ],
      [
        "/\\ expression\\)\\?\\ /",
        "operator"
      ],
      [
        "/\\ expression\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ IDENTIFIER\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\)\\ expression\\ \\(/",
        "operator"
      ],
      [
        "/\\ expression\\ \\(/",
        "operator"
      ],
      [
        "/\\ /\\[\\\\s\\\\S\\]\\*\\?/\\ /",
        "operator"
      ],
      [
        "/\\\\\\\\\\]\\*\\(\\?:\\\\\\\\\\.\\[\\^/",
        "operator"
      ],
      [
        "/\\ tuple_expr\\ /",
        "operator"
      ],
      [
        "/\\ expression\\ /",
        "operator"
      ],
      [
        "/\\ pair\\)\\*\\)\\?\\ /",
        "operator"
      ],
      [
        "/\\ \\(pair\\ \\(/",
        "operator"
      ],
      [
        "/\\ \\|\\ /",
        "operator"
      ],
      [
        "/===/",
        "operator"
      ],
      [
        "/\\\\\\.\\-/",
        "operator"
      ],
      [
        "/\\\\\\.//",
        "operator"
      ],
      [
        "/\\\\\\.\\*/",
        "operator"
      ],
      [
        "/\\.\\.\\./",
        "operator"
      ],
      [
        "/!==/",
        "operator"
      ],
      [
        "/\\\\\\.\\+/",
        "operator"
      ],
      [
        "/>=/",
        "operator"
      ],
      [
        "//=/",
        "operator"
      ],
      [
        "/\\|>/",
        "operator"
      ],
      [
        "/\\&\\&/",
        "operator"
      ],
      [
        "/\\-=/",
        "operator"
      ],
      [
        "/<:/",
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
        "/\\*=/",
        "operator"
      ],
      [
        "/\\+=/",
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
        "/>:/",
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
        "/\\~/",
        "operator"
      ],
      [
        "/!/",
        "operator"
      ],
      [
        "/\\}/",
        "operator"
      ],
      [
        "/\u00ac/",
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
        "/\u00f7/",
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
        "/\\\\/",
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
export const juliaLanguageConfig = {
  "brackets": [
    [
      "(",
      ")"
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
export function registerJuliaLanguage(monaco: any) {
  monaco.languages.register({ id: 'julia' });
  monaco.languages.setMonarchTokensProvider('julia', juliaLanguage);
  monaco.languages.setLanguageConfiguration('julia', juliaLanguageConfig);
}
