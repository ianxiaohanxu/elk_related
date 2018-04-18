#!/bin/bash

start_date=$(date -d "$1" +%s)
end_date=$(date -d "$2" +%s)
while [ $start_date -lt $end_date ]; do
    python logcenter.py -c logcenter.conf -d $(date -d "@$start_date" +%Y-%m-%d)
    start_date=$((start_date + 86400))
done
