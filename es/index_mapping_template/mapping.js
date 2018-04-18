{
  "logcenter": {
    "order": 5,
    "version": 50001,
    "template": "logstash-logcenter-*",
    "settings": {},
    "mappings": {
      "_default_": {
        "dynamic_templates": [
          {
            "giftId": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "giftId"
            }
          },
          {
            "magicID": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "magicID"
            }
          },
          {
            "magicRaw": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "magicRaw"
            }
          },
          {
            "magicStatus": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "magicStatus"
            }
          },
          {
            "goodsid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "goodsid"
            }
          },
          {
            "bookid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "bookid"
            }
          },
          {
            "rd": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "rd"
            }
          },
          {
            "ip": {
              "path_match": "i.ip",
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              }
            }
          },
          {
            "from": {
              "path_match": "m.from",
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              }
            }
          },
          {
            "network_supplier": {
              "path_match": "i.network_supplier",
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              }
            }
          },
          {
            "id": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "id"
            }
          },
          {
            "resource_name": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "resource_name"
            }
          },
          {
            "resource_version": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "resource_version"
            }
          },
          {
            "questioinId": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "questionId"
            }
          },
          {
            "IMType": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "IMType"
            }
          },
          {
            "card_uid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "card_uid"
            }
          },
          {
            "uid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "uid"
            }
          },
          {
            "imei": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "imei"
            }
          },
          {
            "app_version": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "app_version"
            }
          },
          {
            "functype": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "functype"
            }
          },
          {
            "app_supplier": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "app_supplier"
            }
          },
          {
            "micerUid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "micer*Uid"
            }
          },
          {
            "number": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "number"
            }
          },
          {
            "tags": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "tags"
            }
          },
          {
            "sender": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "sender"
            }
          },
          {
            "roomStatus": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "roomStatus"
            }
          },
          {
            "verify_code": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "verify_code"
            }
          },
          {
            "type": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "type"
            }
          },
          {
            "author": {
              "path_match": "m.author",
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              }
            }
          },
          {
            "source": {
              "path_match": "m.source",
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              }
            }
          },
          {
            "sourceType": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "sourceType"
            }
          },
          {
            "videoid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "videoid"
            }
          },
          {
            "roomid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "roomid"
            }
          },
          {
            "roomId": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "roomId"
            }
          },
          {
            "payChannel": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "payChannel"
            }
          },
          {
            "app_id": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "app_id"
            }
          },
          {
            "questionUid": {
              "mapping": {
                "norms": false,
                "type": "text",
                "fields": {
                  "raw": {
                    "ignore_above": 256,
                    "type": "keyword"
                  }
                }
              },
              "match": "questionUid"
            }
          },
          {
            "giftCount": {
              "mapping": {
                "type": "integer"
              },
              "match": "giftCount"
            }
          },
          {
            "linkCount": {
              "mapping": {
                "type": "integer"
              },
              "match": "linkCount"
            }
          },
          {
            "price": {
              "mapping": {
                "type": "float"
              },
              "match": "price"
            }
          },
          {
            "doubleCount": {
              "mapping": {
                "type": "integer"
              },
              "match": "doubleCount"
            }
          },
          {
            "duration": {
              "mapping": {
                "type": "long"
              },
              "match": "duration"
            }
          },
          {
            "questionPrice": {
              "mapping": {
                "type": "float"
              },
              "match": "questioinPrice"
            }
          },
          {
            "micPrice": {
              "mapping": {
                "type": "float"
              },
              "match": "micPrice"
            }
          },
          {
            "amount": {
              "mapping": {
                "type": "integer"
              },
              "match": "amount"
            }
          },
          {
            "tb": {
              "mapping": {
                "type": "long"
              },
              "match": "tb"
            }
          },
          {
            "te": {
              "mapping": {
                "type": "long"
              },
              "match": "te"
            }
          },
          {
            "count": {
              "mapping": {
                "type": "long"
              },
              "match": "count"
            }
          },
          {
            "level": {
              "mapping": {
                "type": "integer"
              },
              "match": "level"
            }
          },
          {
            "giftPrice": {
              "mapping": {
                "type": "float"
              },
              "match": "giftPrice"
            }
          },
          {
            "isDoubleHit": {
              "mapping": {
                "type": "boolean"
              },
              "match": "isDoubleHit"
            }
          },
          {
            "os_unlock": {
              "mapping": {
                "type": "boolean"
              },
              "match": "os_unlock"
            }
          }
        ],
        "_all": {
          "norms": false,
          "enabled": false
        },
        "properties": {
          "@timestamp": {
            "include_in_all": false,
            "type": "date"
          },
          "m": {
            "dynamic": true,
            "properties": {
              "duration": {
                "type": "long"
              },
              "te": {
                "type": "long"
              },
              "price": {
                "type": "double"
              },
              "count": {
                "type": "long"
              },
              "tb": {
                "type": "long"
              }
            }
          }
        }
      }
    },
    "aliases": {}
  }
}