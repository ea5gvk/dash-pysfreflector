FROM python:3.11-slim

RUN pip install --no-cache-dir flask flask-cors

WORKDIR /opt/api

COPY api_server.py .

ENV DB_PATH=/opt/collector/data/collector3.db
ENV API_PORT=5001

EXPOSE 5001

CMD ["python3", "api_server.py"]
