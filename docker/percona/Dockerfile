# FROM debian:jessie

# ENV DEBIAN_FRONTEND noninteractive
# RUN apt-get update && apt-get install -y wget lsb-release

# # RUN echo "deb http://repo.percona.com/apt jessie main" >> /etc/apt/sources.list.d/percona.list
# # RUN echo "deb-src http://repo.percona.com/apt jessie main" >> /etc/apt/sources.list.d/percona.list
# # RUN apt-key adv --keyserver keys.gnupg.net --recv-keys 1C4CBDCDCD2EFD2A
# RUN cd /tmp && wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb && \
#     dpkg -i percona-release_latest.generic_all.deb

# RUN apt-get update
# RUN apt-get install -y percona-xtrabackup-24 percona-xtradb-cluster-server-5.7 percona-toolkit mysqltuner percona-xtradb-cluster-57

# percona-xtrabackup

# #RUN chown -R mysql:mysql /var/run/mysqld
# COPY ./conf /etc/mysql
# #COPY ./pxc-entry.sh /pxc-entry.sh

FROM percona:5.7.18
# # FROM percona:5.7.25-centos

COPY ./conf /etc/mysql/conf.d

# RUN apt-get update && apt-get install -y mytop pv
# #percona-xtrabackup

# RUN apt-get install -y mytop pv
# USER root
# RUN yum install -y pv
# RUN yum install -y mytop pv
RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata