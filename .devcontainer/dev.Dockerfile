#FROM amd64/ubuntu:22.04
FROM ubuntu:22.04

USER root

# Install Python
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y \ 
    python3 python3-pip python3.10-venv  \
    ca-certificates gnupg curl && \
    python3 -m venv .env && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    NODE_MAJOR=18 && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && apt-get install -y nodejs && \
    apt-get remove -y --purge gpg

# Create virtual env and install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# WORKDIR /workspaces/PyEEGBids

# RUN cd api && pip install -r requirements.txt && cd ../web-ui && npm install

#CMD ["sh", "-c", "(npm run start &) && python3 bids_backend.py"]
