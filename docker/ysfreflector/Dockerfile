FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/pysfreflector

RUN git clone https://github.com/iu5jae/pYSFReflector3.git /tmp/pysf3 \
    && cp /tmp/pysf3/ysfreflector3.py . \
    && cp /tmp/pysf3/pysfreflector.ini . \
    && cp /tmp/pysf3/YSFHosts.txt . \
    && cp /tmp/pysf3/dgid.db . \
    && cp /tmp/pysf3/white.db . \
    && cp /tmp/pysf3/black.db . \
    && rm -rf /tmp/pysf3

RUN mkdir -p /opt/pysfreflector/data

EXPOSE 42000/udp
EXPOSE 42223

CMD ["python3", "ysfreflector3.py"]
