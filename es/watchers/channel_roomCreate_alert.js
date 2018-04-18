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
          "query": {
            "bool": {
              "filter": {
                "bool": {
                  "must_not": [
                    {
                      "match_phrase": {
                        "m.result": "5909-直播间话题词不存在 [5909]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-[5407]创建或者开始直播前请到个人中心关闭正在进行的直播"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5407-创建或者开始直播前请到个人中心关闭正在进行的直播 [5407]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-[41]输入信息中含有不符合法律法规的内容"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1001-请求超时。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1019-用户已被禁用 [1019]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-timeout"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "41-输入信息中含有不符合法律法规的内容 [41]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1009-似乎已断开与互联网的连接。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-[1019]用户已被禁用"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-999-已取消"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1001-The request timed out."
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1001-要求逾時。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "5214-房间金额超出范围 [5214]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1005-網絡連線中斷。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1005-网络连接已中断。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-connect+timed+out"
                      }
                    }
                  ],
                  "must": [
                    {
                      "match": {
                        "m.name": "roomCreate"
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
                        "i.app_version": "3.1.7"
                      }
                    }
                  ]
                }
              }
            }
          },
          "aggs": {
            "s_f": {
              "aggs": {
                "unique_uid": {
                  "cardinality": {
                    "field": "m.uid.raw"
                  }
                }
              },
              "filters": {
                "filters": {
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
                  },
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
                  }
                }
              }
            }
          },
          "size": 0
        }
      }
    }
  },
  "condition": {
    "script": {
      "stored": "condition_fail_rate",
      "lang": "painless",
      "params": {
        "threshold1": 5,
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