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
                        "m.result": "2065-你已在一个直播间中，请先退出[87_2065]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "2072-你已在一个直播间中，请先退出[87_2072]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "4-[100_2065]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "4-[100_2076]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6-[101_35]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1-[101_0]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1-[101_0]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1-[101_0]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1-[101_0]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "4-[100_2072]"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "4-[100_2063]"
                      }
                    }
                  ],
                  "must": [
                    {
                      "match": {
                        "m.name": "enterAvRoom"
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
                            "m.result": "0-[100_0]"
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
                                "m.result": "0-[100_0]"
                              }
                            }
                          ]
                        }
                      }
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