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
                        "m.name": "sendIM"
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
                        "m.result": "200-success"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "1-成功"
                      }
                    },
                    {
                      "match_phrase": {
                        "m.result": "6012-wait+serverResp+timeout"
                      }
                    },
                    {
                      "bool": {
                        "must": {
                          "match": {
                            "m.IMType": "102"
                          }
                        },
                        "should": [
                          {
                            "match_phrase": {
                              "m.result": "0-_chatRoomConversation is nil"
                            }
                          },
                          {
                            "match_phrase": {
                              "m.result": "10010-this group does not exist"
                            }
                          },
                          {
                            "match_phrase": {
                              "m.result": "10010-this+group+does+not+exist"
                            }
                          }
                        ]
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
  "condition": {
    "compare": {
      "ctx.payload.hits.total": {
        "gte": 2000
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
        "body": "{\"msgtype\": \"markdown\",\"markdown\": {\"title\": \"{{ctx.metadata.name}}\", \"text\":\"## **{{ctx.metadata.name}}**  \\n > 最近半小时失败数量：{{ctx.payload.hits.total}} \\n\\n   \"},\"at\": {\"isAtAll\": false}}"
      }
    }
  }
}