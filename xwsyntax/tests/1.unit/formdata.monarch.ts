// formdata.monarch.ts
// Auto-generated Monaco language definition
export const formdataLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".formdata",
  "operators": [
    "&",
    "="
  ],
  "symbols": "\\&|=",
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
        "/\\&/",
        "operator"
      ],
      [
        "/=/",
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
export const formdataLanguageConfig = {};
// Register with Monaco Editor
export function registerFormdataLanguage(monaco: any) {
  monaco.languages.register({ id: 'formdata' });
  monaco.languages.setMonarchTokensProvider('formdata', formdataLanguage);
  monaco.languages.setLanguageConfiguration('formdata', formdataLanguageConfig);
}
