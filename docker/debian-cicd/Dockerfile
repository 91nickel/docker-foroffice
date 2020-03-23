FROM debian:stretch

RUN apt-get update && apt-get install -y openssh-client docker-compose curl

# pip & fabric
RUN cd /tmp && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python get-pip.py && pip install fabric

# SSH
RUN mkdir -p ~/.ssh && chmod 700 ~/.ssh && ssh-keyscan img1.foroffice.ru > /root/.ssh/known_hosts

# ENV SSH_PRIVATE_KEY
# ENV SSH_PUBLIC_KEY
# RUN echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa && \
#     echo "$SSH_PUBLIC_KEY" > /root/.ssh/id_rsa.pub && \

# COPY id_rsa /root/.ssh/id_rsa
# COPY id_rsa.pub /root/.ssh/id_rsa.pub

# RUN chmod 600 /root/.ssh/id_rsa && \
#     chmod 600 /root/.ssh/id_rsa.pub

ENV DOCKER_CICD 1
ADD fabfile.py /fabfile.py