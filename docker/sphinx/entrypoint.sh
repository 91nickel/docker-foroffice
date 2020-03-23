#!/bin/bash

# опеределяем на каком хосте запущен сервис
if [ $PRODUCTION = "1" ];
then
    echo "== production config =="
    cp /tmp/sphinx/prod_sphinx.conf /etc/sphinxsearch/sphinx.conf
else
    echo "== develop config =="
    cp /tmp/sphinx/sphinx.conf /etc/sphinxsearch/sphinx.conf
fi

# sleep 5s
# нужна более умная проверка на существование индексов
# if [ ! -f "/indexes_created" ]; then
#     indexer --all
#     touch "/indexes_created"
# fi

indexer --all
service cron start
searchd --nodetach