#!/bin/bash

CONFIG_FILE="/opt/collector/collector3.ini"

if [ -f "$CONFIG_FILE" ]; then
    echo "Loading configuration from $CONFIG_FILE"
    source "$CONFIG_FILE"
fi

REFLECTOR_HOST="${REFLECTOR_HOST:-ysfreflector}"
REFLECTOR_PORT="${REFLECTOR_PORT:-42223}"
DB_PATH="${DB_PATH:-/opt/collector/data/collector3.db}"

sed -i "s|srv_addr_port = .*|srv_addr_port = ('$REFLECTOR_HOST', $REFLECTOR_PORT)|" /opt/collector/collector3.py
sed -i "s|db = r'.*'|db = r'$DB_PATH'|" /opt/collector/collector3.py

echo "Starting collector3.py..."
echo "  Reflector: $REFLECTOR_HOST:$REFLECTOR_PORT"
echo "  Database: $DB_PATH"

exec python3 /opt/collector/collector3.py
