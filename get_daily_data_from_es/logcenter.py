#! -*- coding: utf-8 -*-
import simplejson as json
import sys, requests, pymysql, datetime, optparse

ES_HOST = "http://60.205.58.115:9200"
Authorization = "Basic c2VhcmNoX3NjcmlwdDp1eGluMTIzNA=="

def parse_conf(path):
    '''
    parse the conf file, return a parsed list
    - path: conf file path
    '''
    with open(path, 'r') as fb:
        conf = json.load(fb)
    return conf

def query_data(date, condition):
    '''
    query data from es
    - date: datetime object, figure out the query duration
    - condition: query condition, a dictionary
    '''
    one_day = datetime.timedelta(1)
    headers = {"Authorization": Authorization}
    url = ES_HOST + "/logstash-logcenter-%s,logstash-logcenter-%s/_search" %((date-one_day).strftime("%Y-%m-%d"), date.strftime("%Y-%m-%d"))
    range_filter = {
            "range": {
                "@timestamp": {
                    "gte": date.strftime("%Y-%m-%d"),
                    "lt": (date+one_day).strftime("%Y-%m-%d"),
                    "format": "yyyy-MM-dd",
                    "time_zone": "+08:00"
                    }
                }
            }
    condition["query"]["bool"]["filter"].append(range_filter)
    for i in range(5):
        try:
            resp = requests.post(url, json=condition, headers=headers)
            if resp.status_code == 200: break
        except:
            pass
    return resp.json()

def parse_result(biz_type, query_result):
    '''
    according to biz_type to parse the query result
    - biz_type: biz type, int
    - query_result: query result as a dictionary
    '''
    if not biz_type in (18, 20, 24, 25):
        try:
            return int(float(query_result["aggregations"]["success"]["doc_count"])/query_result["hits"]["total"]*10000)
        except:
            return 0
    elif biz_type in (18, 20, 24):
        try:
            return (int(float(query_result["aggregations"]["duration"]["buckets"]["ls_one"]["doc_count"])/query_result["hits"]["total"]*10000),\
                    int(float(query_result["aggregations"]["duration"]["buckets"]["ls_three"]["doc_count"])/query_result["hits"]["total"]*10000))
        except:
            return (0, 0)
    else:
        try:
            return (query_result["aggregations"]["duration"]["buckets"]["ls_one"]["doc_count"],\
                    query_result["aggregations"]["duration"]["buckets"]["ls_three"]["doc_count"])
        except:
            return (0, 0)

def write_db(connection, sql, biz_type, date, result):
    '''
    write data into db
    - connection: mysql connectin
    - sql: sql string
    - biz_type: biz type, int
    - date: datetime object
    - result: the parsed data
    '''
    date = date.strftime("%Y-%m-%d")
    with connection.cursor() as cursor:
        if not biz_type in (18, 20, 24, 25):
            cursor.execute(sql %(biz_type, date, biz_type, date, result))
        else:
            cursor.execute(sql %(biz_type, date, biz_type, date, result[0], result[1]))


if __name__ == "__main__":
    parser = optparse.OptionParser()
    parser.add_option("-c", "--config", dest="config_path", help="config file path")
    parser.add_option("-d", "--date", dest="datestr", help="date string for data query, format: yyyy-mm-dd, e.g. 2018-01-02")
    (options, args) = parser.parse_args(sys.argv[1:])
    if options.datestr:
        date = datetime.datetime.strptime(options.datestr, "%Y-%m-%d")
    else:
        date = datetime.datetime.today() - datetime.timedelta(1)
    conf = parse_conf(options.config_path)
    #connection = pymysql.connect(host="localhost", user="alexgao", password="1234", db="test")
    connection = pymysql.connect(host="60.205.59.6", user="alexgao", password="123456", db="legend")
    for item in conf:
        result = query_data(date, item["input"])
        result = parse_result(item["biz_type"], result)
        write_db(connection, item["output"]["sql"], item["biz_type"], date, result)
    connection.commit()
    connection.close()
