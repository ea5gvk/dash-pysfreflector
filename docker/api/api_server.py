#!/usr/bin/env python3
from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.environ.get('DB_PATH', '/opt/collector/data/collector3.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/dashboard')
def get_dashboard_data():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found', 'path': DB_PATH}), 500
    
    try:
        conn = get_db_connection()
        
        streams = conn.execute(
            'SELECT * FROM streams ORDER BY date_time DESC LIMIT 100'
        ).fetchall()
        
        reflector = conn.execute(
            'SELECT * FROM reflector ORDER BY date_time DESC LIMIT 1'
        ).fetchone()
        
        connected = conn.execute(
            'SELECT * FROM connected ORDER BY call'
        ).fetchall()
        
        blocked = conn.execute(
            'SELECT * FROM blocked ORDER BY time DESC'
        ).fetchall()
        
        conn.close()
        
        return jsonify({
            'streams': [dict(row) for row in streams],
            'reflector': dict(reflector) if reflector else None,
            'connected': [dict(row) for row in connected],
            'blocked': [dict(row) for row in blocked],
            'status': 'ok'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/streams')
def get_streams():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500
    
    try:
        conn = get_db_connection()
        limit = int(os.environ.get('STREAMS_LIMIT', 100))
        streams = conn.execute(
            f'SELECT * FROM streams ORDER BY date_time DESC LIMIT {limit}'
        ).fetchall()
        conn.close()
        return jsonify([dict(row) for row in streams])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/connected')
def get_connected():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500
    
    try:
        conn = get_db_connection()
        connected = conn.execute('SELECT * FROM connected ORDER BY call').fetchall()
        conn.close()
        return jsonify([dict(row) for row in connected])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reflector')
def get_reflector():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500
    
    try:
        conn = get_db_connection()
        reflector = conn.execute(
            'SELECT * FROM reflector ORDER BY date_time DESC LIMIT 1'
        ).fetchone()
        conn.close()
        return jsonify(dict(reflector) if reflector else {})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/blocked')
def get_blocked():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500
    
    try:
        conn = get_db_connection()
        blocked = conn.execute('SELECT * FROM blocked ORDER BY time DESC').fetchall()
        conn.close()
        return jsonify([dict(row) for row in blocked])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    db_exists = os.path.exists(DB_PATH)
    db_size = os.path.getsize(DB_PATH) if db_exists else 0
    return jsonify({
        'status': 'ok' if db_exists else 'warning',
        'database_exists': db_exists,
        'database_size': db_size,
        'database_path': DB_PATH
    })

if __name__ == '__main__':
    port = int(os.environ.get('API_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
