// mongodb.monarch.ts
// Auto-generated Monaco language definition
export const mongodbLanguage = {
  "defaultToken": "",
  "tokenPostfix": ".mongodb",
  "keywords": [
    "Date",
    "ISODate",
    "ObjectId",
    "aggregate",
    "countDocuments",
    "db",
    "deleteMany",
    "deleteOne",
    "false",
    "find",
    "insertMany",
    "insertOne",
    "new",
    "null",
    "project",
    "replaceOne",
    "true",
    "updateMany",
    "updateOne"
  ],
  "operators": [
    "$addFields",
    "$addToSet",
    "$all",
    "$and",
    "$bucket",
    "$count",
    "$elemMatch",
    "$eq",
    "$exists",
    "$facet",
    "$graphLookup",
    "$group",
    "$gt",
    "$gte",
    "$in",
    "$inc",
    "$limit",
    "$lookup",
    "$lt",
    "$lte",
    "$match",
    "$mul",
    "$ne",
    "$nin",
    "$nor",
    "$not",
    "$or",
    "$pop",
    "$project",
    "$pull",
    "$push",
    "$regex",
    "$rename",
    "$replaceRoot",
    "$set",
    "$size",
    "$skip",
    "$sort",
    "$text",
    "$type",
    "$unset",
    "$unwind",
    "$where",
    "(",
    ")",
    ",",
    ".",
    "/ | /",
    "0",
    "1",
    ":",
    "[",
    "[^",
    "]",
    "]*",
    "{",
    "}"
  ],
  "symbols": "\\[|\\$pull|:|\\$bucket|\\$type|\\$nin|\\$facet|\\$or|\\$match|\\$nor|\\$project|\\$mul|\\$size|\\$skip|\\$addToSet|\\$addFields|\\$text|\\$elemMatch|0|\\$limit|\\}|\\$count|\\$exists|\\$inc|\\$regex|\\$pop|\\)|\\$replaceRoot|\\$push|\\$eq|\\$lte|\\.|/\\ \\|\\ /|\\]|\\$sort|\\]\\*|1|\\$unwind|\\$graphLookup|\\$lt|\\$rename|\\{|\\$not|\\$and|\\$set|\\$unset|\\$ne|\\$in|\\$all|\\$gt|\\[\\^|\\$lookup|\\(|\\$group|,|\\$where|\\$gte",
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
        "/\\$replaceRoot/",
        "operator"
      ],
      [
        "/\\$graphLookup/",
        "operator"
      ],
      [
        "/\\$addFields/",
        "operator"
      ],
      [
        "/\\$elemMatch/",
        "operator"
      ],
      [
        "/\\$addToSet/",
        "operator"
      ],
      [
        "/\\$project/",
        "operator"
      ],
      [
        "/\\$bucket/",
        "operator"
      ],
      [
        "/\\$exists/",
        "operator"
      ],
      [
        "/\\$unwind/",
        "operator"
      ],
      [
        "/\\$rename/",
        "operator"
      ],
      [
        "/\\$lookup/",
        "operator"
      ],
      [
        "/\\$facet/",
        "operator"
      ],
      [
        "/\\$match/",
        "operator"
      ],
      [
        "/\\$limit/",
        "operator"
      ],
      [
        "/\\$count/",
        "operator"
      ],
      [
        "/\\$regex/",
        "operator"
      ],
      [
        "/\\$unset/",
        "operator"
      ],
      [
        "/\\$group/",
        "operator"
      ],
      [
        "/\\$where/",
        "operator"
      ],
      [
        "/\\$pull/",
        "operator"
      ],
      [
        "/\\$type/",
        "operator"
      ],
      [
        "/\\$size/",
        "operator"
      ],
      [
        "/\\$skip/",
        "operator"
      ],
      [
        "/\\$text/",
        "operator"
      ],
      [
        "/\\$push/",
        "operator"
      ],
      [
        "//\\ \\|\\ //",
        "operator"
      ],
      [
        "/\\$sort/",
        "operator"
      ],
      [
        "/\\$nin/",
        "operator"
      ],
      [
        "/\\$nor/",
        "operator"
      ],
      [
        "/\\$mul/",
        "operator"
      ],
      [
        "/\\$inc/",
        "operator"
      ],
      [
        "/\\$pop/",
        "operator"
      ],
      [
        "/\\$lte/",
        "operator"
      ],
      [
        "/\\$not/",
        "operator"
      ],
      [
        "/\\$and/",
        "operator"
      ],
      [
        "/\\$set/",
        "operator"
      ],
      [
        "/\\$all/",
        "operator"
      ],
      [
        "/\\$gte/",
        "operator"
      ],
      [
        "/\\$or/",
        "operator"
      ],
      [
        "/\\$eq/",
        "operator"
      ],
      [
        "/\\$lt/",
        "operator"
      ],
      [
        "/\\$ne/",
        "operator"
      ],
      [
        "/\\$in/",
        "operator"
      ],
      [
        "/\\$gt/",
        "operator"
      ],
      [
        "/\\]\\*/",
        "operator"
      ],
      [
        "/\\[\\^/",
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
        "/0/",
        "operator"
      ],
      [
        "/\\}/",
        "operator"
      ],
      [
        "/\\)/",
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
        "/1/",
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
        "/,/",
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
export const mongodbLanguageConfig = {
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
export function registerMongodbLanguage(monaco: any) {
  monaco.languages.register({ id: 'mongodb' });
  monaco.languages.setMonarchTokensProvider('mongodb', mongodbLanguage);
  monaco.languages.setLanguageConfiguration('mongodb', mongodbLanguageConfig);
}
