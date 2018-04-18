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
                        "m.result": "-1001-请求超时。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1009-似乎已断开与互联网的连接。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "timeout"
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
                        "m.result": "failed+to+connect+to+hongrenshuo.com.cn/60.205.109.107+(port+443)+after+30000ms"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "failed+to+connect+to+hongrenshuo.com.cn/60.205.109.107+(port+443)+after+30000ms:+isConnected+failed:+ETIMEDOUT+(Connection+timed+out)"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "connect+timed+out"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1019-用户已被禁用 [1019]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "Failed+to+connect+to+hongrenshuo.com.cn/60.205.109.107:443"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "当前网络异常，请检查网络设置"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1009-The Internet connection appears to be offline."
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "Failed+to+connect+to+hongrenshuo.com.cn/192.168.0.1:443"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "[1019]用户已被禁用"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-999-已取消"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1009-Internet 連線已斷開。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1009-互聯網已斷線。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1005-网络连接已中断。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1001-請求逾時。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "-1004-未能连接到服务器。"
                      }
                    }
                  ],
                  "must": [
                    {
                      "match": {
                        "m.name": "homePageRefresh"
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
                            "m.result": "200-success"
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
                                "m.result": "200-success"
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
        "threshold1": 50,
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