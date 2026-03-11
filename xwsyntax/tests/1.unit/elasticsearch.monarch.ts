// elasticsearch.monarch.ts
// Auto-generated Monaco language definition
export const elasticsearchLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".elasticsearch",
  "operators": [
    "\n\n// Aggregation\naggregation_query: ",
    "\n\n// Bool query\nbool_query: ",
    "\n\n// Exists query\nexists_query: ",
    "\n\n// Nested query\nnested_query: ",
    "\n\n// Range query\nrange_query: ",
    "\n\n// Terminals\nIDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/\nSTRING: /",
    "\n\n// Wildcard query\nwildcard_query: ",
    "\n\nNULL: ",
    "\n\nagg_definition: STRING ",
    "\n\nagg_param: STRING ",
    "\n\nagg_params: ",
    "\n\nagg_type: ",
    "\n\nbool_clauses: bool_clause (",
    "\n\nfield_match: STRING ",
    "\n\nfield_value: STRING ",
    "\n\nfuzzy_options: fuzzy_option (",
    "\n\nmatch_options: match_option (",
    "\n\nmatch_query: ",
    "\n\nmulti_match_params: ",
    "\n\nquery_string_options: query_string_option (",
    "\n\nrange_condition: range_op ",
    "\n           | query\n\n// Multi-match query\nmulti_match_query: ",
    "\n        | ",
    " (",
    " (STRING | NUMBER)\n            | ",
    " (STRING | match_params)\n\nmatch_params: ",
    " NUMBER\n\n// Prefix query\nprefix_query: ",
    " NUMBER\n\nquery_array: ",
    " NUMBER\n            | ",
    " STRING\n\n// Fuzzy query\nfuzzy_query: ",
    " STRING\n\n// Term queries\nterm_query: ",
    " STRING\n                   | ",
    " STRING ",
    " STRING (",
    " STRING [",
    " STRING)* ",
    " [",
    " agg_definition (",
    " agg_definition)* ",
    " agg_param (",
    " agg_param)* ",
    " agg_params ",
    " agg_type ",
    " bool_clause)*\n\nbool_clause: ",
    " bool_clauses ",
    " field_match ",
    " field_value ",
    " fuzzy_option)*\n\nfuzzy_option: ",
    " fuzzy_options] ",
    " match_option)*\n\nmatch_option: ",
    " match_options]\n\n// Query string\nquery_string_query: ",
    " match_options] ",
    " multi_match_params ",
    " query ",
    " query (",
    " query)* ",
    " query_array\n           | ",
    " query_string_option)*\n\nquery_string_option: ",
    " query_string_options] ",
    " range_condition (",
    " range_condition)* ",
    " value\n\n// Values\nvalue: STRING | NUMBER | BOOLEAN_LITERAL | NULL\n\nBOOLEAN_LITERAL: ",
    " value\n\nrange_op: ",
    " value\n\nterms_query: ",
    " value (",
    " value)* ",
    " | ",
    ")\n                   | ",
    ")\n            | ",
    "AND\\",
    "OR\\",
    "\\",
    "]*",
    "aggs\\",
    "analyzer\\",
    "and\\",
    "avg\\",
    "bool\\",
    "cardinality\\",
    "date_histogram\\",
    "default_field\\",
    "default_operator\\",
    "exists\\",
    "field\\",
    "fields\\",
    "filter\\",
    "fuzziness\\",
    "fuzzy\\",
    "gt\\",
    "gte\\",
    "histogram\\",
    "lt\\",
    "lte\\",
    "match\\",
    "max\\",
    "min\\",
    "minimum_should_match\\",
    "multi_match\\",
    "must\\",
    "must_not\\",
    "nested\\",
    "operator\\",
    "or\\",
    "path\\",
    "prefix\\",
    "prefix_length\\",
    "query\\",
    "query_string\\",
    "range\\",
    "should\\",
    "stats\\",
    "sum\\",
    "term\\",
    "terms\\",
    "value\\",
    "wildcard\\",
    "{"
  ],
  "symbols": "\\ agg_params\\ |\\\n\\\nagg_params:\\ |\\ \\(STRING\\ \\|\\ match_params\\)\\\n\\\nmatch_params:\\ |wildcard\\\\|\\ query\\)\\*\\ |stats\\\\|\\ STRING\\ \\(|default_field\\\\|exists\\\\|fields\\\\|\\\n\\\n//\\ Wildcard\\ query\\\nwildcard_query:\\ |multi_match\\\\|range\\\\|\\ agg_definition\\ \\(|filter\\\\|\\ agg_param\\ \\(|value\\\\|\\ query_string_options\\]\\ |or\\\\|\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |\\\n\\\nagg_type:\\ |gte\\\\|nested\\\\|\\ STRING\\ |\\\n\\\nbool_clauses:\\ bool_clause\\ \\(|\\ STRING\\\n\\\n//\\ Term\\ queries\\\nterm_query:\\ |\\ agg_definition\\)\\*\\ |path\\\\|\\ \\(|must\\\\|\\ \\|\\ |OR\\\\|\\ agg_type\\ |\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |terms\\\\|\\ STRING\\)\\*\\ |\\\n\\\nagg_definition:\\ STRING\\ |\\\n\\\nfield_match:\\ STRING\\ |\\ fuzzy_options\\]\\ |\\\n\\\nrange_condition:\\ range_op\\ |\\ range_condition\\)\\*\\ |field\\\\|prefix\\\\|\\\n\\\nmatch_options:\\ match_option\\ \\(|avg\\\\|\\\n\\\n//\\ Nested\\ query\\\nnested_query:\\ |\\ value\\\n\\\n//\\ Values\\\nvalue:\\ STRING\\ \\|\\ NUMBER\\ \\|\\ BOOLEAN_LITERAL\\ \\|\\ NULL\\\n\\\nBOOLEAN_LITERAL:\\ |\\ query\\ |\\ STRING\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |\\{|fuzziness\\\\|query_string\\\\|and\\\\|\\\n\\\n//\\ Bool\\ query\\\nbool_query:\\ |\\\n\\\n//\\ Terminals\\\nIDENTIFIER:\\ /\\[a\\-zA\\-Z_\\]\\[a\\-zA\\-Z0\\-9_\\]\\*/\\\nSTRING:\\ /|\\ bool_clause\\)\\*\\\n\\\nbool_clause:\\ |must_not\\\\|\\ match_options\\]\\\n\\\n//\\ Query\\ string\\\nquery_string_query:\\ |\\ STRING\\\n\\\n//\\ Fuzzy\\ query\\\nfuzzy_query:\\ |term\\\\|AND\\\\|prefix_length\\\\|sum\\\\|\\\n\\\nquery_string_options:\\ query_string_option\\ \\(|\\ value\\\n\\\nrange_op:\\ |\\\n\\\nmulti_match_params:\\ |bool\\\\|\\ agg_param\\)\\*\\ |\\ range_condition\\ \\(|\\ STRING\\ \\[|query\\\\|\\ value\\\n\\\nterms_query:\\ |min\\\\|\\\n\\\nNULL:\\ |\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ query\\\n\\\n//\\ Multi\\-match\\ query\\\nmulti_match_query:\\ |\\\n\\\n//\\ Aggregation\\\naggregation_query:\\ |\\ value\\ \\(|\\ match_options\\]\\ |\\\n\\\nagg_param:\\ STRING\\ |\\ field_value\\ |fuzzy\\\\|\\\\|analyzer\\\\|\\ field_match\\ |\\ NUMBER\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |default_operator\\\\|\\\n\\\n//\\ Exists\\ query\\\nexists_query:\\ |aggs\\\\|cardinality\\\\|\\ value\\)\\*\\ |date_histogram\\\\|\\\n\\\nfuzzy_options:\\ fuzzy_option\\ \\(|\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |minimum_should_match\\\\|\\ NUMBER\\\n\\\n//\\ Prefix\\ query\\\nprefix_query:\\ |\\ NUMBER\\\n\\\nquery_array:\\ |histogram\\\\|\\ bool_clauses\\ |gt\\\\|\\\n\\\n//\\ Range\\ query\\\nrange_query:\\ |should\\\\|\\ query_string_option\\)\\*\\\n\\\nquery_string_option:\\ |\\]\\*|\\\n\\\nfield_value:\\ STRING\\ |match\\\\|\\ \\[|\\ query\\ \\(|lt\\\\|\\ \\(STRING\\ \\|\\ NUMBER\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |\\ fuzzy_option\\)\\*\\\n\\\nfuzzy_option:\\ |lte\\\\|max\\\\|\\ query_array\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ |operator\\\\|\\ multi_match_params\\ |\\\n\\\nmatch_query:\\ |\\ match_option\\)\\*\\\n\\\nmatch_option:\\ ",
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
        "/\\ value\\\n\\\n//\\ Values\\\nvalue:\\ STRING\\ \\|\\ NUMBER\\ \\|\\ BOOLEAN_LITERAL\\ \\|\\ NULL\\\n\\\nBOOLEAN_LITERAL:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Terminals\\\nIDENTIFIER:\\ /\\[a\\-zA\\-Z_\\]\\[a\\-zA\\-Z0\\-9_\\]\\*/\\\nSTRING:\\ //",
        "operator"
      ],
      [
        "/\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ query\\\n\\\n//\\ Multi\\-match\\ query\\\nmulti_match_query:\\ /",
        "operator"
      ],
      [
        "/\\ match_options\\]\\\n\\\n//\\ Query\\ string\\\nquery_string_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nquery_string_options:\\ query_string_option\\ \\(/",
        "operator"
      ],
      [
        "/\\ query_string_option\\)\\*\\\n\\\nquery_string_option:\\ /",
        "operator"
      ],
      [
        "/\\ \\(STRING\\ \\|\\ match_params\\)\\\n\\\nmatch_params:\\ /",
        "operator"
      ],
      [
        "/\\ NUMBER\\\n\\\n//\\ Prefix\\ query\\\nprefix_query:\\ /",
        "operator"
      ],
      [
        "/\\ STRING\\\n\\\n//\\ Term\\ queries\\\nterm_query:\\ /",
        "operator"
      ],
      [
        "/\\ STRING\\\n\\\n//\\ Fuzzy\\ query\\\nfuzzy_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Wildcard\\ query\\\nwildcard_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Aggregation\\\naggregation_query:\\ /",
        "operator"
      ],
      [
        "/\\ \\(STRING\\ \\|\\ NUMBER\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Nested\\ query\\\nnested_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Exists\\ query\\\nexists_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nmatch_options:\\ match_option\\ \\(/",
        "operator"
      ],
      [
        "/\\\n\\\nfuzzy_options:\\ fuzzy_option\\ \\(/",
        "operator"
      ],
      [
        "/\\ fuzzy_option\\)\\*\\\n\\\nfuzzy_option:\\ /",
        "operator"
      ],
      [
        "/\\ match_option\\)\\*\\\n\\\nmatch_option:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Range\\ query\\\nrange_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nbool_clauses:\\ bool_clause\\ \\(/",
        "operator"
      ],
      [
        "/\\ STRING\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ bool_clause\\)\\*\\\n\\\nbool_clause:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nrange_condition:\\ range_op\\ /",
        "operator"
      ],
      [
        "/\\\n\\\n//\\ Bool\\ query\\\nbool_query:\\ /",
        "operator"
      ],
      [
        "/\\ query_array\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nagg_definition:\\ STRING\\ /",
        "operator"
      ],
      [
        "/\\ query_string_options\\]\\ /",
        "operator"
      ],
      [
        "/\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nfield_match:\\ STRING\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nmulti_match_params:\\ /",
        "operator"
      ],
      [
        "/\\ NUMBER\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ NUMBER\\\n\\\nquery_array:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nfield_value:\\ STRING\\ /",
        "operator"
      ],
      [
        "/\\ value\\\n\\\nterms_query:\\ /",
        "operator"
      ],
      [
        "/minimum_should_match\\\\/",
        "operator"
      ],
      [
        "/\\\n\\\nagg_param:\\ STRING\\ /",
        "operator"
      ],
      [
        "/\\ multi_match_params\\ /",
        "operator"
      ],
      [
        "/\\ range_condition\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ agg_definition\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ value\\\n\\\nrange_op:\\ /",
        "operator"
      ],
      [
        "/\\ range_condition\\ \\(/",
        "operator"
      ],
      [
        "/\\ agg_definition\\ \\(/",
        "operator"
      ],
      [
        "/default_operator\\\\/",
        "operator"
      ],
      [
        "/\\)\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ fuzzy_options\\]\\ /",
        "operator"
      ],
      [
        "/\\ match_options\\]\\ /",
        "operator"
      ],
      [
        "/date_histogram\\\\/",
        "operator"
      ],
      [
        "/\\\n\\\nmatch_query:\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nagg_params:\\ /",
        "operator"
      ],
      [
        "/default_field\\\\/",
        "operator"
      ],
      [
        "/prefix_length\\\\/",
        "operator"
      ],
      [
        "/\\ bool_clauses\\ /",
        "operator"
      ],
      [
        "/query_string\\\\/",
        "operator"
      ],
      [
        "/\\ agg_param\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ field_value\\ /",
        "operator"
      ],
      [
        "/\\ field_match\\ /",
        "operator"
      ],
      [
        "/\\ agg_params\\ /",
        "operator"
      ],
      [
        "/multi_match\\\\/",
        "operator"
      ],
      [
        "/\\ agg_param\\ \\(/",
        "operator"
      ],
      [
        "/\\\n\\\nagg_type:\\ /",
        "operator"
      ],
      [
        "/cardinality\\\\/",
        "operator"
      ],
      [
        "/\\\n\\ \\ \\ \\ \\ \\ \\ \\ \\|\\ /",
        "operator"
      ],
      [
        "/\\ agg_type\\ /",
        "operator"
      ],
      [
        "/\\ STRING\\)\\*\\ /",
        "operator"
      ],
      [
        "/fuzziness\\\\/",
        "operator"
      ],
      [
        "/histogram\\\\/",
        "operator"
      ],
      [
        "/wildcard\\\\/",
        "operator"
      ],
      [
        "/\\ query\\)\\*\\ /",
        "operator"
      ],
      [
        "/\\ STRING\\ \\(/",
        "operator"
      ],
      [
        "/must_not\\\\/",
        "operator"
      ],
      [
        "/\\ STRING\\ \\[/",
        "operator"
      ],
      [
        "/analyzer\\\\/",
        "operator"
      ],
      [
        "/\\ value\\)\\*\\ /",
        "operator"
      ],
      [
        "/operator\\\\/",
        "operator"
      ],
      [
        "/\\ STRING\\ /",
        "operator"
      ],
      [
        "/\\\n\\\nNULL:\\ /",
        "operator"
      ],
      [
        "/\\ value\\ \\(/",
        "operator"
      ],
      [
        "/\\ query\\ \\(/",
        "operator"
      ],
      [
        "/exists\\\\/",
        "operator"
      ],
      [
        "/fields\\\\/",
        "operator"
      ],
      [
        "/filter\\\\/",
        "operator"
      ],
      [
        "/nested\\\\/",
        "operator"
      ],
      [
        "/prefix\\\\/",
        "operator"
      ],
      [
        "/\\ query\\ /",
        "operator"
      ],
      [
        "/should\\\\/",
        "operator"
      ],
      [
        "/stats\\\\/",
        "operator"
      ],
      [
        "/range\\\\/",
        "operator"
      ],
      [
        "/value\\\\/",
        "operator"
      ],
      [
        "/terms\\\\/",
        "operator"
      ],
      [
        "/field\\\\/",
        "operator"
      ],
      [
        "/query\\\\/",
        "operator"
      ],
      [
        "/fuzzy\\\\/",
        "operator"
      ],
      [
        "/match\\\\/",
        "operator"
      ],
      [
        "/path\\\\/",
        "operator"
      ],
      [
        "/must\\\\/",
        "operator"
      ],
      [
        "/term\\\\/",
        "operator"
      ],
      [
        "/bool\\\\/",
        "operator"
      ],
      [
        "/aggs\\\\/",
        "operator"
      ],
      [
        "/gte\\\\/",
        "operator"
      ],
      [
        "/avg\\\\/",
        "operator"
      ],
      [
        "/and\\\\/",
        "operator"
      ],
      [
        "/AND\\\\/",
        "operator"
      ],
      [
        "/sum\\\\/",
        "operator"
      ],
      [
        "/min\\\\/",
        "operator"
      ],
      [
        "/lte\\\\/",
        "operator"
      ],
      [
        "/max\\\\/",
        "operator"
      ],
      [
        "/or\\\\/",
        "operator"
      ],
      [
        "/\\ \\|\\ /",
        "operator"
      ],
      [
        "/OR\\\\/",
        "operator"
      ],
      [
        "/gt\\\\/",
        "operator"
      ],
      [
        "/lt\\\\/",
        "operator"
      ],
      [
        "/\\ \\(/",
        "operator"
      ],
      [
        "/\\]\\*/",
        "operator"
      ],
      [
        "/\\ \\[/",
        "operator"
      ],
      [
        "/\\{/",
        "operator"
      ],
      [
        "/\\\\/",
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
export const elasticsearchLanguageConfig = {
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
export function registerElasticsearchLanguage(monaco: any) {
  monaco.languages.register({ id: 'elasticsearch' });
  monaco.languages.setMonarchTokensProvider('elasticsearch', elasticsearchLanguage);
  monaco.languages.setLanguageConfiguration('elasticsearch', elasticsearchLanguageConfig);
}
