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
                          "gte": "now-30m",
                          "time_zone": "+08:00"
                        }
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
                      "filter": {
                        "bool": {
                          "should": [
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
                  "fail": {
                    "bool": {
                      "must_not": [
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