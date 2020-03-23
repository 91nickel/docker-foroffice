FROM python:3.5

# python3
#RUN pip-compile --annotate -r /docker/requirements.in
ADD requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
WORKDIR /srv/www/vhosts/www.rx8.ru/www
