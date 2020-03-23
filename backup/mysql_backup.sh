#!/bin/bash
DATE=$(date '+%Y-%m-%d')
TIME=$(date '+%H%M%S')
OUT_FILENAME=/backup/${DATE}_${TIME}_foroffice.sql

#mkdir -p /backup/$DATE

mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD --single-transaction --quick --lock-tables=false $MYSQL_DATABASE | pv -L 10m > $OUT_FILENAME
gzip -1 $OUT_FILENAME
