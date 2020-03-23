# FROM node:6.9.4-wheezy
FROM node:8.16.0-stretch

ENV DOCKER=1 DEBIAN_FRONTEND=noninteractive

# RUN mkdir -p /code/project/assets
WORKDIR /foroffice/assets
# ADD package.json package.json
# RUN npm i

# timezone
RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata