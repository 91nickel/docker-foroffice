#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- apache2-foreground "$@"
fi

exec "$@"

service rsyslog start

if [ $EXECUTE_CRON = "1" ]; then
	crontab /docker/apache/crontab.cfg
	service cron start
fi

#if [ $SEND_EMAILS = "1" ]; then
	#service exim4 start
	#service postfix start
#fi

apache2-foreground