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
                        "m.result": "300-用户取消发送"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-似乎已断开与互联网的连接。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-请求超时。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-The Internet connection appears to be offline."
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-互聯網已斷線。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-设备已被封禁 [1119]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-网络连接已中断。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-要求逾時。"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "300-The request timed out."
                      }
                    }
                  ],
                  "must": [
                    {
                      "match": {
                        "m.name": "loginWithWebo"
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
                    "field": "i.imei.raw"
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