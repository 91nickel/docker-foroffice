FROM node:8.16.0-stretch

ENV DOCKER=1 DEBIAN_FRONTEND=noninteractive

# RUN mkdir -p /code/assets
WORKDIR /code/local/assets

# ADD package.json package.json
# RUN yarn install

# timezone
RUN echo "Europe/Moscow" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata