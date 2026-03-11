// promql.monarch.ts
// Auto-generated Monaco language definition
export const promqlLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".promql",
  "keywords": [
    "abs",
    "and",
    "avg",
    "bottomk",
    "by",
    "ceil",
    "count",
    "d",
    "delta",
    "deriv",
    "exp",
    "floor",
    "group",
    "h",
    "hour",
    "idelta",
    "increase",
    "irate",
    "ln",
    "m",
    "max",
    "min",
    "minute",
    "month",
    "ms",
    "offset",
    "or",
    "quantile",
    "rate",
    "round",
    "s",
    "scalar",
    "sort",
    "sqrt",
    "stddev",
    "stdvar",
    "sum",
    "time",
    "timestamp",
    "topk",
    "unless",
    "vector",
    "w",
    "without",
    "y",
    "year"
  ],
  "operators": [
    "!=",
    "!~",
    "%",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    "/",
    "/ | /",
    "<",
    "<=",
    "=",
    "==",
    "=~",
    ">",
    ">=",
    "@",
    "[",
    "[^",
    "]",
    "]*",
    "^",
    "_",
    "clamp_max",
    "clamp_min",
    "count_values",
    "day_of_month",
    "day_of_week",
    "days_in_month",
    "histogram_quantile",
    "label_join",
    "label_replace",
    "log10",
    "log2",
    "predict_linear",
    "sort_desc",
    "{",
    "}"
  ],
  "symbols": "\\[|predict_linear|histogram_quantile|>=|!\\~|<|\\+|\\-|%|=\\~|days_in_month|\\^|day_of_week|\\}|=|log10|clamp_max|\\)|label_join|>|/\\ \\|\\ /|count_values|\\]|\\]\\*|\\{|==|log2|\\[\\^|_|\\(|clamp_min|\\*|<=|!=|,|@|label_replace|sort_desc|day_of_month|/",
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
        "/histogram_quantile/",
        "operator"
      ],
      [
        "/predict_linear/",
        "operator"
      ],
      [
        "/days_in_month/",
        "operator"
      ],
      [
        "/label_replace/",
        "operator"
      ],
      [
        "/count_values/",
        "operator"
      ],
      [
        "/day_of_month/",
        "operator"
      ],
      [
        "/day_of_week/",
        "operator"
      ],
      [
        "/label_join/",
        "operator"
      ],
      [
        "/clamp_max/",
        "operator"
      ],
      [
        "/clamp_min/",
        "operator"
      ],
      [
        "/sort_desc/",
        "operator"
      ],
      [
        "/log10/",
        "operator"
      ],
      [
        "//\\ \\|\\ //",
        "operator"
      ],
      [
        "/log2/",
        "operator"
      ],
      [
        "/>=/",
        "operator"
      ],
      [
        "/!\\~/",
        "operator"
      ],
      [
        "/=\\~/",
        "operator"
      ],
      [
        "/\\]\\*/",
        "operator"
      ],
      [
        "/==/",
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
        "/\\^/",
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
        "/_/",
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
export const promqlLanguageConfig = {
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
export function registerPromqlLanguage(monaco: any) {
  monaco.languages.register({ id: 'promql' });
  monaco.languages.setMonarchTokensProvider('promql', promqlLanguage);
  monaco.languages.setLanguageConfiguration('promql', promqlLanguageConfig);
}
