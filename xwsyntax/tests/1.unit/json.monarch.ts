// json.monarch.ts
// Auto-generated Monaco language definition
export const jsonLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".json",
  "operators": [
    "\npair: string ",
    "  -> null\n\nobject: ",
    "  -> true\n      | ",
    " -> false\n      | ",
    " [pair (",
    " [value (",
    " pair)*] ",
    " value\n\narray: ",
    " value)*] ",
    "s JSON language support\n\n?start: value\n\n?value: object\n      | array\n      | string\n      | number\n      | "
  ],
  "symbols": "\\ pair\\)\\*\\]\\ |\\ \\[pair\\ \\(|\\ \\->\\ false\\\n\\ \\ \\ \\ \\ \\ \\|\\ |\\ \\[value\\ \\(|\\ \\ \\->\\ null\\\n\\\nobject:\\ |\\ value\\)\\*\\]\\ |s\\ JSON\\ language\\ support\\\n\\\n\\?start:\\ value\\\n\\\n\\?value:\\ object\\\n\\ \\ \\ \\ \\ \\ \\|\\ array\\\n\\ \\ \\ \\ \\ \\ \\|\\ string\\\n\\ \\ \\ \\ \\ \\ \\|\\ number\\\n\\ \\ \\ \\ \\ \\ \\|\\ |\\ \\ \\->\\ true\\\n\\ \\ \\ \\ \\ \\ \\|\\ |\\ value\\\n\\\narray:\\ |\\\npair:\\ string\\ ",
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
        "/s\\ JSON\\ language\\ support\\\n\\\n\\?start:\\ value\\\n\\\n\\?value:\\ object\\\n\\ \\ \\ \\ \\ \\ \\|\\ array\\\n\\ \\ \\ \\ \\ \\ \\|\\ string\\\n\\ \\ \\ \\ \\ \\ \\|\\ number\\\n\\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ \\ \\->\\ null\\\n\\\nobject:\\ /",
        "operator"
      ],
      [
        "/\\ \\->\\ false\\\n\\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ \\ \\->\\ true\\\n\\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ value\\\n\\\narray:\\ /",
        "operator"
      ],
      [
        "/\\\npair:\\ string\\ /",
        "operator"
      ],
      [
        "/\\ value\\)\\*\\]\\ /",
        "operator"
      ],
      [
        "/\\ pair\\)\\*\\]\\ /",
        "operator"
      ],
      [
        "/\\ \\[value\\ \\(/",
        "operator"
      ],
      [
        "/\\ \\[pair\\ \\(/",
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
export const jsonLanguageConfig = {};
// Register with Monaco Editor
export function registerJsonLanguage(monaco: any) {
  monaco.languages.register({ id: 'json' });
  monaco.languages.setMonarchTokensProvider('json', jsonLanguage);
  monaco.languages.setLanguageConfiguration('json', jsonLanguageConfig);
}
