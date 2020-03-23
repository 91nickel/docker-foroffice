FROM debian:stretch
# nginx
RUN apt-get update -y && apt-get install -y nginx-extras curl python certbot logrotate && \
    cd /tmp && \
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python3 get-pip.py && \
    pip3 install ngxtop

# certbot 
RUN mkdir -p /var/www/letsencrypt

# ngx_pagespeed dep
# RUN apt-get build-essential zlib1g-dev libpcre3 libpcre3-dev unzip install wget libssl-dev

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

# timezone
RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

COPY conf/ /etc/nginx
COPY ./logrotate /etc/logrotate.d/nginx