## BUILDER

FROM node:11.1.0-slim as builder

LABEL maintainer "no-reply@yoss.com"

ENV PROJECT_DIR=/app
ENV PORT=80

WORKDIR ${PROJECT_DIR}

RUN apt-get update && apt-get install -y curl apt-transport-https

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y yarn python make gcc g++ build-essential > /dev/null

COPY ./package.json ${PROJECT_DIR}
COPY ./yarn.lock ${PROJECT_DIR}

RUN yarn

COPY ./src ${PROJECT_DIR}/src
COPY ./babel.config.js ${PROJECT_DIR}
COPY ./configure.js ${PROJECT_DIR}

RUN yarn build

RUN rm -rf ${PROJECT_DIR}/src

EXPOSE ${PORT}

ENTRYPOINT ["yarn"]
CMD ["start"]

