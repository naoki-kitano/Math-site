import type {AlgebraLineRow} from '../components/Math1AlgebraNumberLine';
export type AlgebraAnswerCase={title:string;note:string;min:number;max:number;marks:number[];rows:AlgebraLineRow[];verification:Record<string,unknown>};
// Exact authored exercise IDs; parameters are taken from each actual problem.
const originals:Record<string,AlgebraAnswerCase>={
  "m1-absolute-distance-distance-1-v1": {
    "title": "中心と距離",
    "note": "中心 $1$、距離 $2$。",
    "min": -2,
    "max": 4,
    "marks": [
      -1,
      1,
      3
    ],
    "rows": [
      {
        "label": "$x=-1,\\ 3$。",
        "points": [
          -1,
          3
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 1,
      "radius": 2,
      "relation": "="
    }
  },
  "m1-absolute-distance-interval-1-v1": {
    "title": "中心と距離",
    "note": "中心 $1$、距離 $2$。",
    "min": -2,
    "max": 4,
    "marks": [
      -1,
      1,
      3
    ],
    "rows": [
      {
        "label": "$-1\\le x\\le3$。",
        "ranges": [
          {
            "from": -1,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 1,
      "radius": 2,
      "relation": "\\le"
    }
  },
  "m1-absolute-distance-distance-2-v1": {
    "title": "中心と距離",
    "note": "中心 $-2$、距離 $3$。",
    "min": -6,
    "max": 2,
    "marks": [
      -5,
      -2,
      1
    ],
    "rows": [
      {
        "label": "$x=-5,\\ 1$。",
        "points": [
          -5,
          1
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": -2,
      "radius": 3,
      "relation": "="
    }
  },
  "m1-absolute-distance-distance-3-v1": {
    "title": "中心と距離",
    "note": "中心 $3$、距離 $1$。",
    "min": 1,
    "max": 5,
    "marks": [
      2,
      3,
      4
    ],
    "rows": [
      {
        "label": "$x=2,\\ 4$。",
        "points": [
          2,
          4
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 3,
      "radius": 1,
      "relation": "="
    }
  },
  "m1-absolute-distance-distance-4-v1": {
    "title": "中心と距離",
    "note": "中心 $2$、距離 $0$。",
    "min": 1,
    "max": 3,
    "marks": [
      2
    ],
    "rows": [
      {
        "label": "$x=2$。",
        "points": [
          2
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 2,
      "radius": 0,
      "relation": "="
    }
  },
  "m1-absolute-distance-distance-5-v1": {
    "title": "中心と距離",
    "note": "中心 $-1$、距離 $2$。",
    "min": -4,
    "max": 2,
    "marks": [
      -3,
      -1,
      1
    ],
    "rows": [
      {
        "label": "$x=-3,\\ 1$。",
        "points": [
          -3,
          1
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": -1,
      "radius": 2,
      "relation": "="
    }
  },
  "m1-absolute-distance-interval-2-v1": {
    "title": "中心と距離",
    "note": "中心 $-2$、距離 $3$。",
    "min": -6,
    "max": 2,
    "marks": [
      -5,
      -2,
      1
    ],
    "rows": [
      {
        "label": "$-5< x<1$。",
        "ranges": [
          {
            "from": -5,
            "to": 1,
            "openFrom": true,
            "openTo": true
          }
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": -2,
      "radius": 3,
      "relation": "<"
    }
  },
  "m1-absolute-distance-interval-3-v1": {
    "title": "中心と距離",
    "note": "中心 $3$、距離 $2$。",
    "min": 0,
    "max": 6,
    "marks": [
      1,
      3,
      5
    ],
    "rows": [
      {
        "label": "$1\\le x\\le5$。",
        "ranges": [
          {
            "from": 1,
            "to": 5,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 3,
      "radius": 2,
      "relation": "\\le"
    }
  },
  "m1-absolute-distance-distance-6-v1": {
    "title": "中心と距離",
    "note": "中心 $4$、距離 $2$。",
    "min": 1,
    "max": 7,
    "marks": [
      2,
      4,
      6
    ],
    "rows": [
      {
        "label": "$x=2,\\ 6$。",
        "points": [
          2,
          6
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 4,
      "radius": 2,
      "relation": "="
    }
  },
  "m1-absolute-distance-distance-7-v1": {
    "title": "中心と距離",
    "note": "中心 $0$、距離 $3$。",
    "min": -4,
    "max": 4,
    "marks": [
      -3,
      0,
      3
    ],
    "rows": [
      {
        "label": "$x=-3,\\ 3$。",
        "points": [
          -3,
          3
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 0,
      "radius": 3,
      "relation": "="
    }
  },
  "m1-absolute-distance-interval-4-v1": {
    "title": "中心と距離",
    "note": "中心 $-1$、距離 $1$。",
    "min": -3,
    "max": 1,
    "marks": [
      -2,
      -1,
      0
    ],
    "rows": [
      {
        "label": "$-2< x<0$。",
        "ranges": [
          {
            "from": -2,
            "to": 0,
            "openFrom": true,
            "openTo": true
          }
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": -1,
      "radius": 1,
      "relation": "<"
    }
  },
  "m1-absolute-distance-interval-5-v1": {
    "title": "中心と距離",
    "note": "中心 $2$、距離 $1$。",
    "min": 0,
    "max": 4,
    "marks": [
      1,
      2,
      3
    ],
    "rows": [
      {
        "label": "$1\\le x\\le3$。",
        "ranges": [
          {
            "from": 1,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 2,
      "radius": 1,
      "relation": "\\le"
    }
  },
  "m1-absolute-distance-zero-distance-extra-1-v1": {
    "title": "中心と距離",
    "note": "中心 $-1$、距離 $0$。",
    "min": -2,
    "max": 0,
    "marks": [
      -1
    ],
    "rows": [
      {
        "label": "$x=-1$。",
        "points": [
          -1
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": -1,
      "radius": 0,
      "relation": "="
    }
  },
  "m1-absolute-distance-zero-distance-extra-2-v1": {
    "title": "中心と距離",
    "note": "中心 $4$、距離 $0$。",
    "min": 3,
    "max": 5,
    "marks": [
      4
    ],
    "rows": [
      {
        "label": "$x=4$。",
        "points": [
          4
        ]
      }
    ],
    "verification": {
      "kind": "absolute",
      "center": 4,
      "radius": 0,
      "relation": "="
    }
  },
  "m1-simultaneous-inequalities-overlap-1-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -1,
    "max": 4,
    "marks": [
      0,
      3
    ],
    "rows": [
      {
        "label": "$x\\ge0$",
        "ranges": [
          {
            "from": 0,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le3$",
        "ranges": [
          {
            "from": null,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$0\\le x\\le3$。",
        "ranges": [
          {
            "from": 0,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\ge",
          0
        ],
        [
          "\\le",
          3
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-empty-1-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 0,
    "max": 3,
    "marks": [
      1,
      2
    ],
    "rows": [
      {
        "label": "$x>2$",
        "ranges": [
          {
            "from": 2,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le1$",
        "ranges": [
          {
            "from": null,
            "to": 1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分なし",
        "points": []
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          2
        ],
        [
          "\\le",
          1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-1-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -1,
    "max": 4,
    "marks": [
      0,
      3
    ],
    "rows": [
      {
        "label": "$x>0$",
        "ranges": [
          {
            "from": 0,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le3$",
        "ranges": [
          {
            "from": null,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$0<x\\le3$。",
        "ranges": [
          {
            "from": 0,
            "to": 3,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          0
        ],
        [
          "\\le",
          3
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-2-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -3,
    "max": 2,
    "marks": [
      -2,
      1
    ],
    "rows": [
      {
        "label": "$x>-2$",
        "ranges": [
          {
            "from": -2,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le1$",
        "ranges": [
          {
            "from": null,
            "to": 1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-2< x\\le1$。",
        "ranges": [
          {
            "from": -2,
            "to": 1,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -2
        ],
        [
          "\\le",
          1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-3-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 1,
    "max": 6,
    "marks": [
      2,
      5
    ],
    "rows": [
      {
        "label": "$x\\ge2$",
        "ranges": [
          {
            "from": 2,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le5$",
        "ranges": [
          {
            "from": null,
            "to": 5,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$2\\le x\\le5$。",
        "ranges": [
          {
            "from": 2,
            "to": 5,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\ge",
          2
        ],
        [
          "\\le",
          5
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-4-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -4,
    "max": 0,
    "marks": [
      -3,
      -1
    ],
    "rows": [
      {
        "label": "$x>-3$",
        "ranges": [
          {
            "from": -3,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le-1$",
        "ranges": [
          {
            "from": null,
            "to": -1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-3< x\\le-1$。",
        "ranges": [
          {
            "from": -3,
            "to": -1,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -3
        ],
        [
          "\\le",
          -1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-5-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 0,
    "max": 3,
    "marks": [
      1,
      2
    ],
    "rows": [
      {
        "label": "$x\\ge1$",
        "ranges": [
          {
            "from": 1,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$1\\le x\\le2$。",
        "ranges": [
          {
            "from": 1,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\ge",
          1
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-empty-2-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 0,
    "max": 2,
    "marks": [
      1
    ],
    "rows": [
      {
        "label": "$x>1$",
        "ranges": [
          {
            "from": 1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le1$",
        "ranges": [
          {
            "from": null,
            "to": 1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分なし",
        "points": []
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          1
        ],
        [
          "\\le",
          1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-empty-3-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -3,
    "max": 1,
    "marks": [
      -2,
      0
    ],
    "rows": [
      {
        "label": "$x>0$",
        "ranges": [
          {
            "from": 0,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le-2$",
        "ranges": [
          {
            "from": null,
            "to": -2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分なし",
        "points": []
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          0
        ],
        [
          "\\le",
          -2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-2-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -2,
    "max": 3,
    "marks": [
      -1,
      2
    ],
    "rows": [
      {
        "label": "$x>-1$",
        "ranges": [
          {
            "from": -1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-1<x\\le2$。",
        "ranges": [
          {
            "from": -1,
            "to": 2,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -1
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-3-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 1,
    "max": 6,
    "marks": [
      2,
      5
    ],
    "rows": [
      {
        "label": "$x>2$",
        "ranges": [
          {
            "from": 2,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le5$",
        "ranges": [
          {
            "from": null,
            "to": 5,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$2<x\\le5$。",
        "ranges": [
          {
            "from": 2,
            "to": 5,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          2
        ],
        [
          "\\le",
          5
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-4-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -4,
    "max": 1,
    "marks": [
      -3,
      0
    ],
    "rows": [
      {
        "label": "$x>-3$",
        "ranges": [
          {
            "from": -3,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le0$",
        "ranges": [
          {
            "from": null,
            "to": 0,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-3<x\\le0$。",
        "ranges": [
          {
            "from": -3,
            "to": 0,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -3
        ],
        [
          "\\le",
          0
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-5-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 0,
    "max": 4,
    "marks": [
      1,
      3
    ],
    "rows": [
      {
        "label": "$x>1$",
        "ranges": [
          {
            "from": 1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le3$",
        "ranges": [
          {
            "from": null,
            "to": 3,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$1<x\\le3$。",
        "ranges": [
          {
            "from": 1,
            "to": 3,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          1
        ],
        [
          "\\le",
          3
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-6-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -2,
    "max": 5,
    "marks": [
      -1,
      4
    ],
    "rows": [
      {
        "label": "$x>-1$",
        "ranges": [
          {
            "from": -1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le4$",
        "ranges": [
          {
            "from": null,
            "to": 4,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-1< x\\le4$。",
        "ranges": [
          {
            "from": -1,
            "to": 4,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -1
        ],
        [
          "\\le",
          4
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-overlap-7-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -1,
    "max": 3,
    "marks": [
      0,
      2
    ],
    "rows": [
      {
        "label": "$x\\ge0$",
        "ranges": [
          {
            "from": 0,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$0\\le x\\le2$。",
        "ranges": [
          {
            "from": 0,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\ge",
          0
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-empty-4-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -2,
    "max": 0,
    "marks": [
      -1
    ],
    "rows": [
      {
        "label": "$x>-1$",
        "ranges": [
          {
            "from": -1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le-1$",
        "ranges": [
          {
            "from": null,
            "to": -1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分なし",
        "points": []
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -1
        ],
        [
          "\\le",
          -1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-empty-5-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 1,
    "max": 5,
    "marks": [
      2,
      4
    ],
    "rows": [
      {
        "label": "$x>4$",
        "ranges": [
          {
            "from": 4,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分なし",
        "points": []
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          4
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-6-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -3,
    "max": 5,
    "marks": [
      -2,
      4
    ],
    "rows": [
      {
        "label": "$x>-2$",
        "ranges": [
          {
            "from": -2,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le4$",
        "ranges": [
          {
            "from": null,
            "to": 4,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$-2<x\\le4$。",
        "ranges": [
          {
            "from": -2,
            "to": 4,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          -2
        ],
        [
          "\\le",
          4
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-solve-system-7-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -1,
    "max": 3,
    "marks": [
      0,
      2
    ],
    "rows": [
      {
        "label": "$x>0$",
        "ranges": [
          {
            "from": 0,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$0<x\\le2$。",
        "ranges": [
          {
            "from": 0,
            "to": 2,
            "openFrom": true,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          0
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-singleton-extra-1-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 1,
    "max": 3,
    "marks": [
      2
    ],
    "rows": [
      {
        "label": "$x\\ge2$",
        "ranges": [
          {
            "from": 2,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分 $x=2$",
        "points": [
          2
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\ge",
          2
        ],
        [
          "\\le",
          2
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-singleton-extra-2-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": -2,
    "max": 0,
    "marks": [
      -1
    ],
    "rows": [
      {
        "label": "$x\\le-1$",
        "ranges": [
          {
            "from": null,
            "to": -1,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\ge-1$",
        "ranges": [
          {
            "from": -1,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分 $x=-1$",
        "points": [
          -1
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\le",
          -1
        ],
        [
          "\\ge",
          -1
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-same-direction-extra-1-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 0,
    "max": 4,
    "marks": [
      1,
      3
    ],
    "rows": [
      {
        "label": "$x>1$",
        "ranges": [
          {
            "from": 1,
            "to": null,
            "openFrom": true,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x\\ge3$",
        "ranges": [
          {
            "from": 3,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "共通部分：$x\\ge3$。",
        "ranges": [
          {
            "from": 3,
            "to": null,
            "openFrom": false,
            "openTo": false
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          ">",
          1
        ],
        [
          "\\ge",
          3
        ]
      ]
    }
  },
  "m1-simultaneous-inequalities-same-direction-extra-2-v1": {
    "title": "両方の条件に入る範囲",
    "note": "",
    "min": 1,
    "max": 3,
    "marks": [
      2
    ],
    "rows": [
      {
        "label": "$x\\le2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": false
          }
        ]
      },
      {
        "label": "$x<2$",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": true
          }
        ]
      },
      {
        "label": "共通部分：$x<2$。",
        "ranges": [
          {
            "from": null,
            "to": 2,
            "openFrom": false,
            "openTo": true
          }
        ]
      }
    ],
    "verification": {
      "kind": "intersection",
      "conditions": [
        [
          "\\le",
          2
        ],
        [
          "<",
          2
        ]
      ]
    }
  }
};
const chapterAliases:Record<string,string>={
  "m1-number-expression-check-practice-m1-absolute-distance-distance-v1": "m1-absolute-distance-distance-2-v1",
  "m1-number-expression-check-review-m1-absolute-distance-distance-v1": "m1-absolute-distance-distance-6-v1",
  "m1-number-expression-check-practice-m1-absolute-distance-interval-v1": "m1-absolute-distance-interval-2-v1",
  "m1-number-expression-check-review-m1-absolute-distance-interval-v1": "m1-absolute-distance-interval-4-v1",
  "m1-number-expression-check-practice-m1-absolute-distance-interval-form-2-v1": "m1-absolute-distance-interval-3-v1",
  "m1-number-expression-check-practice-m1-absolute-distance-zero-distance-v1": "m1-absolute-distance-distance-4-v1",
  "m1-number-expression-check-review-m1-absolute-distance-zero-distance-v1": "m1-absolute-distance-zero-distance-extra-2-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-overlap-v1": "m1-simultaneous-inequalities-overlap-2-v1",
  "m1-number-expression-check-review-m1-simultaneous-inequalities-overlap-v1": "m1-simultaneous-inequalities-overlap-6-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-overlap-form-2-v1": "m1-simultaneous-inequalities-overlap-3-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-empty-v1": "m1-simultaneous-inequalities-empty-2-v1",
  "m1-number-expression-check-review-m1-simultaneous-inequalities-empty-v1": "m1-simultaneous-inequalities-empty-5-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-empty-form-2-v1": "m1-simultaneous-inequalities-empty-3-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-solve-system-v1": "m1-simultaneous-inequalities-solve-system-2-v1",
  "m1-number-expression-check-review-m1-simultaneous-inequalities-solve-system-v1": "m1-simultaneous-inequalities-solve-system-6-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-singleton-v1": "m1-simultaneous-inequalities-singleton-extra-1-v1",
  "m1-number-expression-check-review-m1-simultaneous-inequalities-singleton-v1": "m1-simultaneous-inequalities-singleton-extra-2-v1",
  "m1-number-expression-check-practice-m1-simultaneous-inequalities-same-direction-v1": "m1-simultaneous-inequalities-same-direction-extra-1-v1",
  "m1-number-expression-check-review-m1-simultaneous-inequalities-same-direction-v1": "m1-simultaneous-inequalities-same-direction-extra-2-v1"
};
export const math1AlgebraAnswerCases:Record<string,AlgebraAnswerCase>={...originals,...Object.fromEntries(Object.entries(chapterAliases).map(([id,source])=>[id,originals[source]]))};
export const math1AlgebraAnswerCaseIds=Object.keys(math1AlgebraAnswerCases);
