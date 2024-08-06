FROM node:lts-slim as node_binaries


FROM ubuntu:20.04

ARG wait_for_it_mirror=https://raw.githubusercontent.com/vishnubob/wait-for-it/81b1373f17855a4dc21156cfe1694c31d7d1792e/wait-for-it.sh
ADD "${wait_for_it_mirror}" /usr/local/bin/wait-for-it
RUN chmod 755 /usr/local/bin/wait-for-it

RUN apt-get update && \
	apt-get install -y \
    openssl && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1000 musicapp && \
	useradd -ms /bin/bash -u 1000 -g 1000 musicapp && \
	mkdir -p /app && \
	chown musicapp:musicapp /app

COPY --from=node_binaries /usr/local/bin/node /usr/local/bin/node
RUN npm install -g yarn


USER musicapp
WORKDIR /app

COPY --chown=musicapp:musicapp package.json .
COPY --chown=musicapp:musicapp yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

COPY --chown=musicapp:musicapp src src/

CMD ["yarn", "start"]
