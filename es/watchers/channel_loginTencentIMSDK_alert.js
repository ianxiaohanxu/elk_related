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
                        "m.name": "loginTencentIMSDK"
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": "now-30m",
                          "time_zone": "+08:00"
                        }
                      }
                    },
                    {
                      "match": {
                        "i.os": "android"
                      }
                    },
                    {
                      "match": {
                        "i.app_supplier": "00"
                      }
                    },
                    {
                      "match": {
                        "i.app_version": "3.1.9"
                      }
                    }
                  ],
                  "must_not": [
                    {
                      "match_phrase": {
                        "m.result": "6012-请求失败，请你稍后重试。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6012"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6200-Network+is+not+avaliable"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6200"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6208"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6208-Kicked+off+by+other+device"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6012-wait+serverResp+timeout"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6023-logout+explicitly+or+kicked+off+by+other+device"
                      }
                    }
                  ]
                }
              }
            }
          },
          "aggs": {
            "s_f": {
              "filters": {
                "filters": {
                  "success": {
                    "bool": {
                      "should": [
                        {
                          "match_phrase": {
                            "m.result": "200-success"
                          }
                        },
                        {
                          "match_phrase": {
                            "m.result": "200"
                          }
                        }
                      ]
                    }
                  },
                  "fail": {
                    "bool": {
                      "must_not": [
                        {
                          "match_phrase": {
                            "m.result": "200-success"
                          }
                        },
                        {
                          "match_phrase": {
                            "m.result": "200"
                          }
                        }
                      ]
                    }
                  }
                }
              },
              "aggs": {
                "unique_uid": {
                  "cardinality": {
                    "field": "m.uid.raw"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "condition": {
    "script": {
      "stored": "condition_fail_rate",
      "lang": "painless",
      "params": {
        "threshold1": 10,
        "threshold2": 0.2
      }
    }
  },
  "actions": {
    "alert_action": {
      "transform": {
        "script": {
          "stored": "action_data_transform"
        }
      },
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
        "body": "{\"msgtype\": \"markdown\",\"markdown\": {\"title\": \"{{ctx.metadata.name}}\", \"text\":\"## **{{ctx.metadata.name}}**  \\n > 最近半小时失败数量：{{ctx.payload.fail}} \\n\\n > 最近半小时总数量：{{ctx.payload.all}} \\n\\n > 最近半小时失败率：{{ctx.payload.fail_rate}}%  \"},\"at\": {\"isAtAll\": false}}"
      }
    }
  }
}