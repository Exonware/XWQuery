// lucene.monarch.ts
// Auto-generated Monaco language definition
export const luceneLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".lucene",
  "operators": [
    "\n\nWORD: /[^\\s",
    "\n\nphrase_content: WORD (WS WORD)*\n\ngroup: ",
    "\n\nrange: ",
    "\n\nrange_end: WORD | ",
    "\n\nrange_start: WORD | ",
    "\n\nwildcard: WORD (",
    "\n     | ",
    " (NUMBER)?\n\nboost: clause ",
    " NUMBER\n\nfield_query: FIELD_NAME ",
    " clause\n\nboolean_op: ",
    " phrase_content ",
    " query ",
    " range_end ",
    " range_start ",
    " | ",
    ")+\n\nfuzzy: WORD ",
    "\\"
  ],
  "symbols": "\\\n\\\nrange:\\ |\\\n\\\nrange_end:\\ WORD\\ \\|\\ |\\ \\|\\ |\\ clause\\\n\\\nboolean_op:\\ |\\ range_start\\ |\\\n\\\nrange_start:\\ WORD\\ \\|\\ |\\\n\\\nWORD:\\ /\\[\\^\\\\s|\\ NUMBER\\\n\\\nfield_query:\\ FIELD_NAME\\ |\\\n\\ \\ \\ \\ \\ \\|\\ |\\ query\\ |\\\\|\\ phrase_content\\ |\\\n\\\nphrase_content:\\ WORD\\ \\(WS\\ WORD\\)\\*\\\n\\\ngroup:\\ |\\)\\+\\\n\\\nfuzzy:\\ WORD\\ |\\\n\\\nwildcard:\\ WORD\\ \\(|\\ range_end\\ |\\ \\(NUMBER\\)\\?\\\n\\\nboost:\\ clause\\ ",
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
        "/\\\n\\\nphrase_content:\\ WORD\\ \\(WS\\ WORD\\)\\*\\\n\\\ngroup:\\ /",
        "operator"
      ],
      [
        "/\\ NUMBER\\\n\\\nfield_query:\\ FIELD_NAME\\ /",
        "operator"
      ],
      [
        "/\\ \\(NUMBER\\)\\?\\\n\\\nboost:\\ clause\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nrange_start:\\ WORD\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ clause\\\n\\\nboolean_op:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nrange_end:\\ WORD\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nwildcard:\\ WORD\\ \\(/",
        "operator"
      ],
      [
        "/\\ phrase_content\\ /",
        "operator"
      ],
      [
        "/\\)\\+\\\n\\\nfuzzy:\\ WORD\\ /",
        "operator"
      ],
      [
        "/\\ range_start\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nWORD:\\ /\\[\\^\\\\s/",
        "operator"
      ],
      [
        "/\\ range_end\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nrange:\\ /",
        "operator"
      ],
      [
        "/\\\n\\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ query\\ /",
        "operator"
      ],
      [
        "/\\ \\|\\ /",
        "operator"
      ],
      [
        "/\\\\/",
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
export const luceneLanguageConfig = {};
// Register with Monaco Editor
export function registerLuceneLanguage(monaco: any) {
  monaco.languages.register({ id: 'lucene' });
  monaco.languages.setMonarchTokensProvider('lucene', luceneLanguage);
  monaco.languages.setLanguageConfiguration('lucene', luceneLanguageConfig);
}
