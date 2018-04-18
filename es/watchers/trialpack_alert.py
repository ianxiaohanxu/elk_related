#-*- coding: utf-8 -*-
import requests, optparse
import simplejson as json

HOST = "http://60.205.58.115:9200"
PATH = "/_xpack/watcher/watch/"
Authorization = "Basic c2VhcmNoX3NjcmlwdDp1eGluMTIzNA=="

def recreate_trialpack_alert(watcher_id, version, channel_ID):
    url = HOST + PATH + watcher_id
    headers = { "Authorization": Authorization }
    for counter in range(5):
        try:
            origin_watcher = requests.get(url=url, headers=headers)
            if origin_watcher.status_code == 200:
                break
        except:
            pass
    new_watcher_body = origin_watcher.json()["watch"]
    new_watcher_body["input"]["search"]["request"]["body"]["query"]["bool"]["filter"]["bool"]["must"][-2]["match"]["i.app_supplier"] = channel_ID
    new_watcher_body["input"]["search"]["request"]["body"]["query"]["bool"]["filter"]["bool"]["must"][-1]["match"]["i.app_version"] = version
    for counter in range(5):
        try:
            origin_watcher = requests.put(url=url, headers=headers, json=new_watcher_body)
            if origin_watcher.status_code == 200:
                break
        except:
            pass

if __name__ == "__main__":
    parser = optparse.OptionParser(usage="python trialpack_alert.py -c CONFIG -v VERSION -i CHANNEL_ID")
    parser.add_option("-c", "--config", type="string", action="store", dest="config", help="config file path")
    parser.add_option("-v", "--version", type="string", action="store", dest="version", help="trial pack version, for example: 3.1.7")
    parser.add_option("-i", "--id", type="string", action="store", dest="channel_id", help="trial pack channel id, for example: 00", default="00")
    (options, args) = parser.parse_args()
    with open(options.config, "r") as fb:
        watch_ids = json.load(fb)
    for watch_id in watch_ids:
        recreate_trialpack_alert(watch_id, options.version, options.channel_id)
        

