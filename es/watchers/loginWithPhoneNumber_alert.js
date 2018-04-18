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
                        "m.name": "loginWithPhoneNumber"
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
                        "m.result": "300-[1003]我们不认识这个验证码，再来一个"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-[1002]这个验证码是谁？再来一个"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-我们不认识这个验证码，再来一个 [1003]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-这个验证码是谁？再来一个 [1002]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-似乎已断开与互联网的连接。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-timeout"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-[1119]设备已被封禁"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-当前网络异常，请检查网络设置"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-请求超时。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-connect+timed+out"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-网络连接已中断。"
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
                    "field": "i.imei.raw"
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
        "threshold1": 20,
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