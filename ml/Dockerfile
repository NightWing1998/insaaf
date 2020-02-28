# FROM python:3.7-alpine3.11
FROM python:3.7.2-stretch
WORKDIR /usr/src/app

COPY requirements.txt ./
# RUN apk add gcc
RUN pip3 install --no-cache-dir -r requirements.txt
# RUN apk --update add --virtual scipy-runtime python py-pip \
# 	&& apk add --virtual scipy-build \
# 	build-base python-dev openblas-dev freetype-dev pkgconfig gfortran lapack-dev \
# 	&& ln -s /usr/include/locale.h /usr/include/xlocale.h \
# 	&& pip install --no-cache-dir -U pip wheel setuptools \
# 	&& pip install --no-cache-dir requirements.txt \
# 	&& apk del scipy-build \
# 	&& apk add --virtual scipy-runtime \
# 	freetype libgfortran libgcc libpng  libstdc++ musl openblas tcl tk \
# 	&& rm -rf /var/cache/apk/*

EXPOSE 5000

COPY . .

CMD uwsgi app.ini