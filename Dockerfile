FROM ubuntu:latest
MAINTAINER Aubrey Cottle <acottle@taimalabs.com>
RUN apt-get update
RUN apt-get upgrade -y
RUN curl https://install.meteor.com/ | sh
RUN mkdir -p /srv/kiosk

VOLUME /srv/kiosk

EXPOSE 80
