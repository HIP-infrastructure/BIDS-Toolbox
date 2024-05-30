ARG CI_REGISTRY_IMAGE
ARG TAG
ARG DOCKERFS_TYPE
ARG DOCKERFS_VERSION
ARG JUPYTERLAB_DESKTOP_VERSION
FROM ${CI_REGISTRY_IMAGE}/${DOCKERFS_TYPE}:${DOCKERFS_VERSION}${TAG}
LABEL maintainer="florian.sipp@chuv.ch"

ARG DEBIAN_FRONTEND=noninteractive
ARG CARD
ARG CI_REGISTRY
ARG APP_NAME
ARG APP_VERSION

LABEL app_version=$APP_VERSION
LABEL app_tag=$TAG

WORKDIR /apps/${APP_NAME}

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y \ 
    python3 python3-pip \
    debian-keyring debian-archive-keyring apt-transport-https \
    ca-certificates gnupg curl gpg git \
    libnss3 libatk1.0-0 libcups2 libatspi2.0-0 libxcomposite1 \
    libxdamage1 libxrandr2 libpango-1.0-0 libcairo2 libasound2 libatomic1 && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    mkdir -p /etc/apt/keyrings && \
    apt-get update && apt-get install -y caddy && \
    mkdir ./install && \
    curl -sSOJ https://dl.nwjs.io/v0.84.0/nwjs-v0.84.0-linux-x64.tar.gz && \
    tar xzf nwjs-v*-linux-x64.tar.gz -C ./install && \
    chmod -R 757 ./install && \
    rm nwjs-v*-linux-x64.tar.gz && \
    apt-get remove -y --purge gpg

#Clone project in our fork and checkout ${APP_VERSION}
RUN git clone https://github.com/HIP-infrastructure/BIDS-Toolbox.git

ADD "https://api.github.com/repos/HIP-infrastructure/BIDS-Toolbox/commits?sha=main&per_page=1" bidstoolbox_latest_commit

RUN cd BIDS-Toolbox && git checkout main && git pull && \
    cp Caddyfile /etc/caddy/Caddyfile && \
    cd api && \
    pip install -r requirements.txt && \
    cd .. && \
    cd web-ui && \
    mv build/* /usr/share/caddy/

RUN apt-get autoremove -y --purge && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV APP_SPECIAL="no"
ENV APP_CMD="/apps/${APP_NAME}/start.sh"
ENV PROCESS_NAME="nw"
ENV APP_DATA_DIR_ARRAY=""
ENV DATA_DIR_ARRAY=""

HEALTHCHECK --interval=10s --timeout=10s --retries=5 --start-period=30s \
  CMD sh -c "/apps/${APP_NAME}/scripts/process-healthcheck.sh \
  && /apps/${APP_NAME}/scripts/ls-healthcheck.sh /home/${HIP_USER}/nextcloud/"

COPY ./scripts/ scripts/
ADD ./apps/${APP_NAME}/start.sh start.sh

EXPOSE 80

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
