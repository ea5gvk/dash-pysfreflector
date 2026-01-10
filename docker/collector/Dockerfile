FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/collector

RUN git clone https://github.com/iu5jae/pYSFReflector3.git /tmp/pysf3 \
    && cp /tmp/pysf3/dashboard/collector3/collector3.py . \
    && rm -rf /tmp/pysf3

RUN mkdir -p /opt/collector/data

COPY entrypoint.sh /opt/collector/
RUN chmod +x /opt/collector/entrypoint.sh

ENV REFLECTOR_HOST=ysfreflector
ENV REFLECTOR_PORT=42223
ENV DB_PATH=/opt/collector/data/collector3.db

ENTRYPOINT ["/opt/collector/entrypoint.sh"]
