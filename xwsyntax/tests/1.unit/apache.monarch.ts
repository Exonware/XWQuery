// apache.monarch.ts
// Auto-generated Monaco language definition
export const apacheLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".apache",
  "operators": [
    " /[^",
    "<",
    "</",
    ">",
    "\\"
  ],
  "symbols": "<|\\\\|\\ /\\[\\^|>|</",
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
        "/<//",
        "operator"
      ],
      [
        "/</",
        "operator"
      ],
      [
        "/\\\\/",
        "operator"
      ],
      [
        "/>/",
        "operator"
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
export const apacheLanguageConfig = {};
// Register with Monaco Editor
export function registerApacheLanguage(monaco: any) {
  monaco.languages.register({ id: 'apache' });
  monaco.languages.setMonarchTokensProvider('apache', apacheLanguage);
  monaco.languages.setLanguageConfiguration('apache', apacheLanguageConfig);
}
