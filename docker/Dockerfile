# Stage 1
FROM node:latest AS node-binaries

RUN mkdir /node-binaries && \
    cp -R /usr/local/* /node-binaries/

# Stage 2: Use the official Golang image to get the binaries
FROM golang:latest AS go-binaries

RUN mkdir /go-binaries && \
    cp -R /usr/local/go/* /go-binaries/

# Stage 3: Use the official terraform image to get the binaries
FROM hashicorp/terraform:latest AS terraform-binaries

RUN mkdir /terraform-binaries && \
    cp -R /bin/terraform /terraform-binaries/

FROM ubuntu:22.04

COPY --from=node-binaries /node-binaries/ /usr/local/
COPY --from=go-binaries /go-binaries/ /usr/local/go
COPY --from=terraform-binaries /terraform-binaries/ /bin

RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    zip \
    jq \
    curl \
    xz-utils \
    git \
    openssh-client \
    apt-transport-https \
    lsb-release \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin

# install faas-cli
RUN curl -SL https://cli.openfaas.com | sh

RUN echo 'alias fmctl="npm run"' >> /root/.bashrc

WORKDIR /experiments

CMD ["/bin/bash"]