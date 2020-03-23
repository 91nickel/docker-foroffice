FROM debian:jessie
RUN apt-get update -y
RUN apt-get install -y mysql-client unixodbc libpq5 libexpat1 curl cron
RUN curl http://sphinxsearch.com/files/sphinxsearch_2.2.11-release-1~jessie_amd64.deb > /tmp/sphinxsearch_2.2.11-release-1~jessie_amd64.deb
WORKDIR /tmp
RUN dpkg -i sphinxsearch_2.2.11-release-1~jessie_amd64.deb

COPY ./conf /tmp/sphinx
COPY ./entrypoint.sh /entrypoint.sh

COPY ./crontab.cfg /crontab.cfg
RUN crontab /crontab.cfg && mkdir -p /var/lib/sphinxsearch/data/foroffice

RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata
