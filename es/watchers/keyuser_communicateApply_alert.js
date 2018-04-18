{
  "trigger": {
    "schedule": {
      "interval": "5m"
    }
  },
  "input": {
    "search": {
      "request": {
        "search_type": "query_then_fetch",
        "indices": [
          "<logstash-logcenter-{now/d{YYYY-MM-dd|+08:00}}>",
          "<logstash-logcenter-{now-1d/d{YYYY-MM-dd|+08:00}}>"
        ],
        "types": [],
        "body": {
          "size": 0,
          "query": {
            "bool": {
              "filter": {
                "bool": {
                  "must": [
                    {
                      "match": {
                        "m.name": "communicateApply"
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": "now-5m",
                          "time_zone": "+08:00"
                        }
                      }
                    },
                    {
                      "terms": {
                        "m.uid.raw": [
                          "1967348781062",
                          "1959503802378",
                          "1956357017635",
                          "1956352979001",
                          "1956066873400",
                          "1950397968394",
                          "1943522488353",
                          "1942255292478",
                          "1936129806398",
                          "1932239347734",
                          "1931448803336",
                          "1929008177158",
                          "1926842867774",
                          "1924881104918",
                          "1921406689330",
                          "1913465192498",
                          "1905178075194",
                          "1896044888086",
                          "1894463561782",
                          "1893010898954",
                          "1889667874820",
                          "1882723041282",
                          "1866992607234",
                          "1865733668866",
                          "1864084561924",
                          "1861827305475",
                          "1861183791109",
                          "1855694282759",
                          "1813752422405",
                          "1797448933395",
                          "1967348781062",
                          "1959503802378",
                          "1956357017635",
                          "1956352979001",
                          "1956066873400",
                          "1950397968394",
                          "1943522488353",
                          "1942255292478",
                          "1936129806398",
                          "1932239347734",
                          "1931448803336",
                          "1929008177158",
                          "1926842867774",
                          "1924881104918",
                          "1921406689330",
                          "1913465192498",
                          "1905178075194",
                          "1896044888086",
                          "1894463561782",
                          "1893010898954",
                          "1889667874820",
                          "1882723041282",
                          "1866992607234",
                          "1865733668866",
                          "1864084561924",
                          "1861827305475",
                          "1861183791109",
                          "1855694282759",
                          "1813752422405",
                          "1797448933395",
                          "1721295290371"
                        ]
                      }
                    }
                  ],
                  "must_not": [
                    {
                      "match_phrase": {
                        "m.result": "5422-该用户已被拉黑，无法连麦 [5422]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5417-[5417]直播间连线功能已关闭"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5417-直播间连线功能已关闭 [5417]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5422-[5422]该用户已被拉黑，无法连麦"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1001-请求超时。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1005-网络连接已中断。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5423-[5423]虚拟房间暂时不支持连麦噢"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "200-操作成功"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "200-操作成功 [200]"
                      }
                    }
                  ]
                }
              }
            }
          },
          "aggs": {
            "count_by_user": {
              "terms": {
                "field": "m.uid.raw"
              }
            }
          }
        }
      }
    }
  },
  "condition": {
    "script": {
      "stored": "condition_keyuser",
      "lang": "painless",
      "params": {
        "threshold1": 3
      }
    }
  },
  "actions": {
    "alert_action": {
      "webhook": {
        "scheme": "https",
        "host": "oapi.dingtalk.com",
        "port": 443,
        "method": "post",
        "path": "/robot/send",
        "params": {
          "access_token": "d1ec23250a9e927ce642e0d21377f91d9675c413da8a9ab837413ef0376187d4"
        },
        "headers": {
          "Content-Type": "application/json"
        },
        "body": "{\"msgtype\": \"markdown\",\"markdown\": {\"title\": \"{{ctx.metadata.name}}\", \"text\":\"## **{{ctx.metadata.name}}**  \\n > 最近5分钟问题发生次数及对应用户：{{ctx.payload.aggregations.count_by_user.buckets}} \\n\\n  \"},\"at\": {\"isAtAll\": false}}"
      }
    }
  }
}