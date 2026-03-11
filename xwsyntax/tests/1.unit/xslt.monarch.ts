// xslt.monarch.ts
// Auto-generated Monaco language definition
export const xsltLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".xslt",
  "operators": [
    "\n\nattribute: IDENTIFIER ",
    "\n\nxsl_apply_templates: ",
    "\n\nxsl_choose: ",
    "\n\nxsl_for_each: ",
    "\n\nxsl_if: ",
    "\n\nxsl_otherwise: ",
    "\n\nxsl_when: ",
    " (attribute)* ",
    " (content)* ",
    " (xsl_when)* (xsl_otherwise)? ",
    " /[^",
    " IDENTIFIER ",
    " IDENTIFIER (attribute)* (",
    " attribute_value\n\nattribute_value: ",
    " | ",
    ")\n\ncontent: xsl_element | literal_element | text | xsl_value_of | xsl_for_each | xsl_if | xsl_choose | xsl_apply_templates\n\nxsl_value_of: ",
    ")\n\nliteral_element: ",
    "/\n\nstylesheet_element: xsl_element | literal_element\n\nxsl_element: ",
    "<?xml",
    "?>",
    "[^",
    "\\"
  ],
  "symbols": "\\ \\|\\ |\\\n\\\nattribute:\\ IDENTIFIER\\ |\\\n\\\nxsl_otherwise:\\ |\\ /\\[\\^|\\?>|\\ attribute_value\\\n\\\nattribute_value:\\ |\\ IDENTIFIER\\ |\\)\\\n\\\nliteral_element:\\ |<\\?xml|\\ \\(content\\)\\*\\ |\\\n\\\nxsl_for_each:\\ |\\\n\\\nxsl_if:\\ |\\)\\\n\\\ncontent:\\ xsl_element\\ \\|\\ literal_element\\ \\|\\ text\\ \\|\\ xsl_value_of\\ \\|\\ xsl_for_each\\ \\|\\ xsl_if\\ \\|\\ xsl_choose\\ \\|\\ xsl_apply_templates\\\n\\\nxsl_value_of:\\ |\\ IDENTIFIER\\ \\(attribute\\)\\*\\ \\(|/\\\n\\\nstylesheet_element:\\ xsl_element\\ \\|\\ literal_element\\\n\\\nxsl_element:\\ |\\\n\\\nxsl_when:\\ |\\\n\\\nxsl_choose:\\ |\\[\\^|\\\\|\\ \\(attribute\\)\\*\\ |\\\n\\\nxsl_apply_templates:\\ |\\ \\(xsl_when\\)\\*\\ \\(xsl_otherwise\\)\\?\\ ",
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
        "/\\)\\\n\\\ncontent:\\ xsl_element\\ \\|\\ literal_element\\ \\|\\ text\\ \\|\\ xsl_value_of\\ \\|\\ xsl_for_each\\ \\|\\ xsl_if\\ \\|\\ xsl_choose\\ \\|\\ xsl_apply_templates\\\n\\\nxsl_value_of:\\ /",
        "operator"
      ],
      [
        "//\\\n\\\nstylesheet_element:\\ xsl_element\\ \\|\\ literal_element\\\n\\\nxsl_element:\\ /",
        "operator"
      ],
      [
        "/\\ attribute_value\\\n\\\nattribute_value:\\ /",
        "operator"
      ],
      [
        "/\\ \\(xsl_when\\)\\*\\ \\(xsl_otherwise\\)\\?\\ /",
        "operator"
      ],
      [
        "/\\ IDENTIFIER\\ \\(attribute\\)\\*\\ \\(/",
        "operator"
      ],
      [
        "/\\\n\\\nattribute:\\ IDENTIFIER\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_apply_templates:\\ /",
        "operator"
      ],
      [
        "/\\)\\\n\\\nliteral_element:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_otherwise:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_for_each:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_choose:\\ /",
        "operator"
      ],
      [
        "/\\ \\(attribute\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ IDENTIFIER\\ /",
        "operator"
      ],
      [
        "/\\ \\(content\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_when:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nxsl_if:\\ /",
        "operator"
      ],
      [
        "/<\\?xml/",
        "operator"
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
        "/\\?>/",
        "operator"
      ],
      [
        "/\\[\\^/",
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
export const xsltLanguageConfig = {};
// Register with Monaco Editor
export function registerXsltLanguage(monaco: any) {
  monaco.languages.register({ id: 'xslt' });
  monaco.languages.setMonarchTokensProvider('xslt', xsltLanguage);
  monaco.languages.setLanguageConfiguration('xslt', xsltLanguageConfig);
}
