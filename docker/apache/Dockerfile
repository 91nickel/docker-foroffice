# FROM php:7.0.17-apache
FROM php:7.1.29-apache-stretch
# FROM php:7.2-apache-stretch

# libwebp-dev, libjpeg62-turbo-dev, libpng12-dev, libfreetype6-dev => docker-php-ext-configure gd
# memcached => libmemcached-dev
# mcrypt => libmcrypt-dev
# graphviz => webgrind

# RUN apt-get update
# RUN apt-cache search libpng

RUN apt-get update && \
    apt-get install -y mysql-client cron sudo rsyslog libwebp-dev \
    libjpeg62-turbo-dev libpng-dev libfreetype6-dev libmcrypt-dev libmemcached-dev telnet \
    libzip-dev graphviz

# php7 memcache
RUN apt-get install unzip && \
    cd /tmp && \
    curl -sSL -o php7.zip https://github.com/websupport-sk/pecl-memcache/archive/php7.zip && \
    unzip php7 && \
    cd pecl-memcache-php7 && \
    /usr/local/bin/phpize && \
    ./configure --with-php-config=/usr/local/bin/php-config && \
    make && \
    make install && \
    echo "extension=memcache.so" > /usr/local/etc/php/conf.d/ext-memcache.ini && \
    rm -rf /tmp/pecl-memcache-php7 php7.zip

# docker-php-ext-install mysqli pdo pdo_mysql mcrypt && \
RUN docker-php-source extract && \
    docker-php-ext-install mysqli pdo pdo_mysql mcrypt && \
    docker-php-ext-configure gd --with-webp-dir=/usr/include --with-png-dir=/usr/include --with-jpeg-dir=/usr/include --with-freetype-dir=/usr/include && \
    pecl install opcache redis zip mailparse xdebug XHProf && \
    docker-php-ext-enable opcache redis zip mailparse xdebug xhprof && \
    docker-php-ext-install gd && \
    docker-php-source delete && \
    a2enmod rewrite

# memcache

# php composer
RUN cd /tmp && \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    # php -r "if (hash_file('sha384', 'composer-setup.php') === '93b54496392c062774670ac18b134c3b3a95e5a5e5c8f1a9f115f203b75bf9a129d5daa8ba6a13e2cc8a1da0806388a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

# timezone
RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

# msmtp
RUN apt-get install -y -q msmtp && touch /var/log/msmtp.log && chown www-data:www-data /var/log/msmtp.log

# Install GeoIP PHP extension.
# RUN apt-get install -y  libgeoip-dev wget \
#     #&& rm -rf /var/lib/apt/lists/* \
#     && pecl install geoip-1.1.1 \
#     && docker-php-ext-enable geoip

ADD ./conf/geoip/GeoLite2-City.mmdb /opt/maxmind/GeoLite2-City.mmdb
# ADD ./conf/geoip/GeoLite2-City.mmdb /usr/share/GeoIP/GeoIPCity.dat
# ADD ./conf/geoip/GeoIP.conf /etc/GeoIP.conf

# это узкое место, надо что-то придумать чтоб обновлять файл крона автоматом
#COPY crontab.cfg /crontab.cfg
#RUN crontab /crontab.cfg && \
#    mkdir -p /var/log/cron && touch /var/log/cron/cron.log && \
RUN mkdir -p /foroffice/logs/apache

COPY conf/apache2 /etc/apache2
COPY conf/php /usr/local/etc/php
COPY ./msmtprc /etc/msmtprc
COPY ./entrypoint.sh /entrypoint.sh
COPY ./logrotate /etc/logrotate.d/apache_foroffice

WORKDIR /srv/www/vhosts/www.rx8.ru/www

# COPY conf/exim4/update-exim4.conf.conf  /etc/exim4/update-exim4.conf.conf