// nginx.monarch.ts
// Auto-generated Monaco language definition
export const nginxLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".nginx",
  "operators": [
    " /[^",
    " | ",
    ";",
    "\\",
    "{",
    "}"
  ],
  "symbols": "\\ \\|\\ |\\}|\\\\|\\{|;|\\ /\\[\\^",
  "brackets": [
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
        "/\\ /\\[\\^/",
        "operator"
      ],
      [
        "/\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\}/",
        "operator"
      ],
      [
        "/\\\\/",
        "operator"
      ],
      [
        "/\\{/",
        "operator"
      ],
      [
        "/;/",
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
export const nginxLanguageConfig = {
  "brackets": [
    [
      "{",
      "}"
    ]
  ],
  "autoClosingPairs": [
    {
      "open": "{",
      "close": "}"
    }
  ],
  "surroundingPairs": [
    {
      "open": "{",
      "close": "}"
    }
  ]
};
// Register with Monaco Editor
export function registerNginxLanguage(monaco: any) {
  monaco.languages.register({ id: 'nginx' });
  monaco.languages.setMonarchTokensProvider('nginx', nginxLanguage);
  monaco.languages.setLanguageConfiguration('nginx', nginxLanguageConfig);
}
