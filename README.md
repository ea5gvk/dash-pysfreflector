# pYSF3 Reflector Dashboard

Dashboard moderno y responsive para visualizar la actividad de un reflector C4FM pYSF3. Desarrollado por **ADN Systems Spain**.

![Dashboard Preview](attached_assets/ADN_Systems_EA_logo_transparente_1767983339225.png)

## Características

- 🎨 Diseño moderno "Dark Tech" con efectos de glow y blur
- 🌍 Banderas de país automáticas basadas en prefijos de indicativos de radioaficionado (300+ países)
- 📱 Totalmente responsive (desktop, tablet y móvil)
- 📻 Badges distintivos para modelos de radio Yaesu (handhelds, móviles, estaciones base, bridges)
- 🔄 Actualización automática de datos cada 60 segundos
- 📊 Estadísticas en tiempo real del reflector

## Requisitos del Sistema

- **Sistema Operativo:** Debian 11/12 o Ubuntu 20.04/22.04
- **Node.js:** v18.x o superior (para instalación manual)
- **Docker:** v20.x o superior (para instalación con Docker)
- **RAM:** 512 MB mínimo
- **Disco:** 500 MB espacio libre

---

## Instalación con Docker (Recomendado)

La forma más fácil de instalar todo el sistema es usando Docker Compose. Incluye:
- **pYSFReflector3** - El reflector C4FM
- **collector3** - Recolector de datos
- **API** - Servidor JSON para el dashboard
- **Dashboard** - Interfaz web React

### Estructura de archivos de configuración

```
config/
├── pysfreflector.ini    # Configuración del reflector
├── collector3.ini       # Configuración del collector
├── dashboard.json       # Configuración del dashboard
├── dgid.db              # Descripciones de DGID
├── white.db             # Lista blanca de callsigns
├── black.db             # Lista negra de callsigns
└── YSFHosts.txt         # Hosts YSF
```

### 1. Instalar Docker y Docker Compose

```bash
# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install -y docker-compose-plugin

# Cerrar sesión y volver a entrar para aplicar grupo docker
```

### 2. Clonar el repositorio

```bash
cd /opt
sudo git clone https://github.com/TU_USUARIO/pysf3-dashboard.git
sudo chown -R $USER:$USER pysf3-dashboard
cd pysf3-dashboard
```

### 3. Configurar el reflector

Editar `config/pysfreflector.ini`:

```ini
[YSFReflector3]
REF_ID=11111              # Tu ID de reflector
REF_NAME=MyReflector      # Nombre del reflector
REF_DESC=C4FM Reflector   # Descripción
REFLECTOR_PORT=42000      # Puerto UDP

[Json]
JSON_PORT=42223           # Puerto para collector
JSON_BIND=0.0.0.0

[APRS]
APRS_EN=True              # Habilitar APRS
APRS_SERVER=euro.aprs2.net
APRS_PORT=14580
APRS_SSID=7
APRS_PASSCODE=0           # Tu passcode APRS

[Admin]
ADMIN_ENABLED=True
ADMIN_PASSWORD=admin123   # Cambiar en producción!

[DGID]
DGID_DEFAULT=0
DGID_LOCAL=1

[Contact]
CONTACT=admin@example.com
WEB=https://example.com
```

### 4. Configurar descripciones de DGID

Editar `config/dgid.db`:

```
9,Local_reflector
22,MP_Italia
30,MP_Lazio
# ... añadir tus DGIDs
```

### 5. Configurar listas de acceso (opcional)

**Lista blanca** (`config/white.db`):
```
# Dejar vacío para permitir todos
EA4XXX
EA5YYY
```

**Lista negra** (`config/black.db`):
```
# Callsigns bloqueados
BADCALL
```

### 6. Iniciar todos los servicios

```bash
docker compose up -d
```

### 7. Verificar que todo funciona

```bash
# Ver estado de los contenedores
docker compose ps

# Ver logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f ysfreflector
docker compose logs -f collector
docker compose logs -f api
docker compose logs -f dashboard
```

### 8. Acceder al dashboard

Abrir en el navegador: `http://TU_IP:8080`

### Comandos Docker útiles

```bash
# Parar todos los servicios
docker compose down

# Reiniciar un servicio
docker compose restart ysfreflector

# Actualizar imágenes y reiniciar
docker compose pull
docker compose up -d --build

# Ver uso de recursos
docker stats

# Limpiar volúmenes (¡borra la base de datos!)
docker compose down -v
```

### Puertos expuestos

| Servicio     | Puerto      | Descripción                    |
|--------------|-------------|--------------------------------|
| Reflector    | 42000/UDP   | Puerto principal del reflector |
| Collector    | 42223       | Puerto JSON para collector     |
| API          | 5001        | API REST para el dashboard     |
| Dashboard    | 8080        | Interfaz web                   |

### Modificar configuración sin reconstruir

Los archivos en `config/` están montados como volúmenes. Para aplicar cambios:

```bash
# Reiniciar el servicio afectado
docker compose restart ysfreflector   # Si cambias pysfreflector.ini
docker compose restart collector      # Si cambias collector3.ini
docker compose restart dashboard      # Si cambias dashboard.json
```

### Persistencia de datos

Los datos se almacenan en volúmenes Docker:
- `reflector-data` - Datos del reflector
- `collector-db` - Base de datos SQLite

Para backup:
```bash
# Backup de la base de datos
docker compose exec collector cat /opt/collector/data/collector3.db > backup.db

# O copiar directamente del volumen
docker cp pysf3-collector:/opt/collector/data/collector3.db ./backup.db
```

---

## Referencia Completa de Configuración Docker

### Estructura de directorios

```
pysf3-dashboard/
├── docker-compose.yml           # Orquestación de servicios
├── Dockerfile                   # Build del dashboard
├── .dockerignore                # Archivos excluidos del build
├── docker/
│   ├── ysfreflector/
│   │   └── Dockerfile           # Imagen del reflector
│   ├── collector/
│   │   ├── Dockerfile           # Imagen del collector
│   │   └── entrypoint.sh        # Script de inicio
│   ├── api/
│   │   ├── Dockerfile           # Imagen de la API
│   │   └── api_server.py        # Servidor Flask
│   └── nginx.conf               # Configuración de Nginx
├── config/
│   ├── pysfreflector.ini        # Config reflector (volumen)
│   ├── collector3.ini           # Config collector (volumen)
│   ├── dashboard.json           # Config dashboard (volumen)
│   ├── dgid.db                  # Descripciones DGID (volumen)
│   ├── white.db                 # Lista blanca (volumen)
│   ├── black.db                 # Lista negra (volumen)
│   └── YSFHosts.txt             # Hosts YSF (volumen)
└── client/                      # Código fuente React
```

### Archivo: config/pysfreflector.ini

Configuración completa del reflector pYSF3:

```ini
[YSFReflector3]
# Identificación del reflector
REF_ID=11111                    # ID único del reflector (5 dígitos)
REF_NAME=ES ADN-Systems         # Nombre corto (máx 16 caracteres)
REF_DESC=Reflector C4FM Spain   # Descripción (máx 14 caracteres)
REFLECTOR_PORT=42000            # Puerto UDP principal

[Json]
# Puerto para comunicación con collector3.py
JSON_PORT=42223                 # Puerto de datos JSON
JSON_BIND=0.0.0.0               # IP de escucha (0.0.0.0 = todas)

[APRS]
# Integración con red APRS
APRS_EN=True                    # Habilitar APRS (True/False)
APRS_SERVER=euro.aprs2.net      # Servidor APRS regional
APRS_PORT=14580                 # Puerto APRS
APRS_SSID=7                     # SSID para el reflector
APRS_PASSCODE=0                 # Tu passcode APRS (obtener en aprs.fi)

[Admin]
# Administración remota
ADMIN_ENABLED=True              # Habilitar admin (True/False)
ADMIN_PASSWORD=CambiaEstaClave  # Contraseña de administración

[DGID]
# Configuración de grupos digitales
DGID_DEFAULT=0                  # DGID por defecto para nuevas conexiones
DGID_LOCAL=1                    # DGID local del reflector

[YSFNetwork]
# Registro en red YSF
YSF_ENABLED=False               # Registrar en ysfreflector.de
YSF_SERVER=register.ysfreflector.de
YSF_PORT=42000

[Contact]
# Información de contacto
CONTACT=admin@tu-dominio.com    # Email de contacto
WEB=https://tu-dominio.com      # Web del reflector
```

### Archivo: config/collector3.ini

Configuración del recolector de datos:

```ini
# Host del reflector (nombre del servicio Docker o IP)
REFLECTOR_HOST=ysfreflector

# Puerto JSON del reflector
REFLECTOR_PORT=42223

# Ruta de la base de datos SQLite
DB_PATH=/opt/collector/data/collector3.db

# Mostrar transmisiones bloqueadas (True/False)
SHOW_TB=True
```

### Archivo: config/dashboard.json

Configuración del dashboard React:

```json
{
  "apiUrl": "/api",
  "refreshInterval": 60000,
  "theme": "dark",
  "title": "C4FM Reflector Dashboard",
  "showBlocked": true,
  "maxStreams": 100,
  "features": {
    "showFlags": true,
    "showRadioModels": true,
    "showCoordinates": true,
    "showAprs": true
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `apiUrl` | string | URL base de la API |
| `refreshInterval` | number | Intervalo de actualización en ms |
| `theme` | string | Tema visual (dark/light) |
| `title` | string | Título del dashboard |
| `showBlocked` | boolean | Mostrar pestaña de bloqueados |
| `maxStreams` | number | Máximo de streams a mostrar |
| `features.showFlags` | boolean | Mostrar banderas de país |
| `features.showRadioModels` | boolean | Mostrar badges de radios |
| `features.showCoordinates` | boolean | Mostrar coordenadas GPS |
| `features.showAprs` | boolean | Mostrar estado APRS |

### Archivo: config/dgid.db

Descripciones personalizadas para cada DGID:

```
# Formato: DGID,Descripción
0,Default
1,Local
9,Emergencias
22,Nacional España
30,Andalucía
31,Aragón
32,Asturias
33,Baleares
34,Canarias
35,Cantabria
36,Castilla-La Mancha
37,Castilla y León
38,Cataluña
39,Extremadura
40,Galicia
41,Madrid
42,Murcia
43,Navarra
44,País Vasco
45,La Rioja
46,Valencia
```

### Archivo: config/white.db

Lista blanca de indicativos permitidos:

```
# Lista blanca - solo estos indicativos pueden conectar
# Dejar vacío para permitir todos
# Formato: CALLSIGN (uno por línea)

# Ejemplo:
# EA4XXX
# EA5YYY
# EB1ZZZ
```

### Archivo: config/black.db

Lista negra de indicativos bloqueados:

```
# Lista negra - estos indicativos serán rechazados
# Formato: CALLSIGN (uno por línea)

# Ejemplo:
# PIRATA1
# NOCALL
```

### Archivo: config/YSFHosts.txt

Lista de hosts YSF para interconexión:

```
# Formato: ID;Nombre;Descripción;IP;Puerto
# Ejemplo:
# 21421;ES Spain;Reflector Nacional;ysf.spain.com;42000
# 00001;IT Italy;Reflector Italia;ysf.italy.net;42000
```

### Variables de entorno del docker-compose.yml

Puedes sobrescribir variables de entorno sin editar los archivos:

```yaml
# En docker-compose.yml o docker-compose.override.yml
services:
  collector:
    environment:
      - REFLECTOR_HOST=192.168.1.100    # IP externa del reflector
      - REFLECTOR_PORT=42223
      - DB_PATH=/opt/collector/data/collector3.db

  api:
    environment:
      - DB_PATH=/opt/collector/data/collector3.db
      - API_PORT=5001
      - STREAMS_LIMIT=200               # Más streams en la respuesta

  dashboard:
    environment:
      - API_URL=http://api:5001
```

### Personalizar puertos expuestos

Editar `docker-compose.yml` para cambiar puertos:

```yaml
services:
  ysfreflector:
    ports:
      - "42000:42000/udp"    # Puerto reflector → cambiar primer número
      
  api:
    ports:
      - "8081:5001"          # API en puerto 8081 externo
      
  dashboard:
    ports:
      - "80:80"              # Dashboard en puerto 80 (requiere root)
```

### Uso con proxy inverso externo

Si ya tienes Nginx/Traefik, puedes exponer solo los puertos necesarios:

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  dashboard:
    ports: []  # No exponer puerto
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`reflector.tu-dominio.com`)"
      
  api:
    ports: []  # No exponer puerto
    
  ysfreflector:
    ports:
      - "42000:42000/udp"  # Solo el reflector necesita puerto público
```

### Logs y monitorización

```bash
# Ver logs en tiempo real de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f ysfreflector
docker compose logs -f collector
docker compose logs -f api
docker compose logs -f dashboard

# Ver últimas 100 líneas
docker compose logs --tail=100 collector

# Ver uso de recursos
docker stats

# Inspeccionar un contenedor
docker inspect pysf3-collector
```

### Actualizar a nueva versión

```bash
cd /opt/pysf3-dashboard

# Obtener últimos cambios
git pull

# Reconstruir imágenes
docker compose build --no-cache

# Reiniciar servicios
docker compose up -d

# Verificar que todo funciona
docker compose ps
docker compose logs -f
```

### Solución de problemas Docker

**El collector no conecta al reflector:**
```bash
# Verificar que el reflector está corriendo
docker compose logs ysfreflector

# Verificar conectividad entre contenedores
docker compose exec collector ping ysfreflector
```

**La API no encuentra la base de datos:**
```bash
# Verificar que el volumen existe
docker volume ls | grep collector

# Verificar contenido del volumen
docker compose exec collector ls -la /opt/collector/data/
```

**El dashboard no carga datos:**
```bash
# Probar la API directamente
curl http://localhost:5001/api/health
curl http://localhost:5001/api/dashboard

# Ver logs del dashboard
docker compose logs dashboard
```

**Reiniciar todo desde cero:**
```bash
# Parar y eliminar todo (¡incluida la base de datos!)
docker compose down -v

# Reconstruir desde cero
docker compose up -d --build
```

---

## Instalación Manual en Debian

### 1. Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verificar la instalación:
```bash
node --version  # Debería mostrar v20.x.x
npm --version   # Debería mostrar 10.x.x
```

### 3. Instalar Git

```bash
sudo apt install -y git
```

### 4. Clonar el repositorio

```bash
cd /opt
sudo git clone https://github.com/TU_USUARIO/pysf3-dashboard.git
sudo chown -R $USER:$USER pysf3-dashboard
cd pysf3-dashboard
```

### 5. Instalar dependencias

```bash
npm install
```

### 6. Construir para producción

```bash
npm run build
```

### 7. Configurar el puerto (opcional)

Por defecto el dashboard corre en el puerto 5000. Para cambiarlo, editar las variables de entorno:

```bash
export PORT=3000
```

## Ejecución

### Modo desarrollo

```bash
npm run dev
```

### Modo producción con PM2 (recomendado)

Instalar PM2 globalmente:
```bash
sudo npm install -g pm2
```

Iniciar el dashboard:
```bash
pm2 start npm --name "pysf3-dashboard" -- run dev
```

Configurar inicio automático:
```bash
pm2 startup
pm2 save
```

Comandos útiles de PM2:
```bash
pm2 status              # Ver estado
pm2 logs pysf3-dashboard # Ver logs
pm2 restart pysf3-dashboard # Reiniciar
pm2 stop pysf3-dashboard    # Detener
```

### Alternativa: Servicio systemd

Crear el archivo de servicio:
```bash
sudo nano /etc/systemd/system/pysf3-dashboard.service
```

Contenido:
```ini
[Unit]
Description=pYSF3 Reflector Dashboard
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/pysf3-dashboard
ExecStart=/usr/bin/npm run dev
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pysf3-dashboard
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

Activar y arrancar el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable pysf3-dashboard
sudo systemctl start pysf3-dashboard
```

Verificar estado:
```bash
sudo systemctl status pysf3-dashboard
```

## Configuración con Nginx (proxy inverso)

Para servir el dashboard en el puerto 80/443 con SSL:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/pysf3-dashboard
```

Configuración:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar el sitio:
```bash
sudo ln -s /etc/nginx/sites-available/pysf3-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Añadir SSL con Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## Integración con pYSF3 Reflector

El dashboard lee datos de la base de datos SQLite generada por el script `collector3.py` del reflector pYSF3.

### Funcionamiento de collector3.py

El script `collector3.py`:
1. Se conecta al reflector pYSF3 vía UDP (puerto 42223 por defecto)
2. Recibe datos JSON en tiempo real del reflector
3. Almacena toda la información en una base de datos SQLite

### Configuración del collector

Editar las variables al inicio de `collector3.py`:

```python
# Dirección y puerto del reflector pYSF3 (sección Json en pysfreflector.ini)
srv_addr_port = ('127.0.0.1', 42223)

# Ruta de la base de datos SQLite
db = r'/opt/pysfreflector/collector3.db'

# Mostrar streams bloqueados en el dashboard
show_TB = True

# Links especiales (descripción:serial)
ser_lnks = {"BM_2222":"E0C4W", "XLX-Link":"G0gBJ", "BlueDV":"F5ZFW"}

# Descripciones de DGID
gid_desc = { "9":"Local_reflector", "22":"MP_Italia", ... }
```

### Estructura de la base de datos

El collector crea las siguientes tablas en SQLite:

- **streams**: Historial de transmisiones (callsign, gateway, DGID, radio, coordenadas, etc.)
- **reflector**: Información del reflector (ID, nombre, descripción, APRS, etc.)
- **connected**: Gateways conectados actualmente
- **blocked**: Callsigns bloqueados por reglas

### Ruta típica de la base de datos
```
/opt/pysfreflector/collector3.db
```

### Integración en Tiempo Real

El sistema funciona con la siguiente arquitectura:

```
┌─────────────────┐    UDP/JSON     ┌──────────────┐    SQLite    ┌─────────┐    JSON     ┌───────────┐
│ pYSFReflector3  │ ──────────────> │ collector3.py │ ──────────> │   API   │ ─────────> │ Dashboard │
│  (puerto 42000) │   puerto 42223  │              │  .db file   │ PHP/Py  │            │   React   │
└─────────────────┘                 └──────────────┘             └─────────┘            └───────────┘
```

### Paso 1: Instalar y ejecutar collector3.py

El collector3.py se conecta al reflector pYSF3 y guarda los datos en SQLite:

```bash
cd /opt/pysfreflector
python3 collector3.py &
```

Para ejecutarlo como servicio, crear `/etc/systemd/system/collector3.service`:
```ini
[Unit]
Description=pYSF3 Collector
After=network.target ysfreflector.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pysfreflector
ExecStart=/usr/bin/python3 /opt/pysfreflector/collector3.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable collector3
sudo systemctl start collector3
```

### Paso 2: Crear la API

Para que el dashboard React pueda leer los datos de SQLite, necesitas crear un endpoint API.

#### Opción A: PHP (Recomendado si ya tienes Apache/Nginx con PHP)

Crear `/var/www/html/api.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache, must-revalidate');

$db_path = '/opt/pysfreflector/collector3.db';

if (!file_exists($db_path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database not found']);
    exit;
}

try {
    $db = new SQLite3($db_path, SQLITE3_OPEN_READONLY);
    
    // Obtener streams (últimos 100)
    $streams_result = $db->query('SELECT * FROM streams ORDER BY date_time DESC LIMIT 100');
    $streams = [];
    while ($row = $streams_result->fetchArray(SQLITE3_ASSOC)) {
        $streams[] = $row;
    }
    
    // Obtener info del reflector
    $reflector_result = $db->query('SELECT * FROM reflector ORDER BY date_time DESC LIMIT 1');
    $reflector = $reflector_result->fetchArray(SQLITE3_ASSOC);
    
    // Obtener estaciones conectadas
    $connected_result = $db->query('SELECT * FROM connected ORDER BY call');
    $connected = [];
    while ($row = $connected_result->fetchArray(SQLITE3_ASSOC)) {
        $connected[] = $row;
    }
    
    // Obtener bloqueados
    $blocked_result = $db->query('SELECT * FROM blocked ORDER BY time DESC');
    $blocked = [];
    while ($row = $blocked_result->fetchArray(SQLITE3_ASSOC)) {
        $blocked[] = $row;
    }
    
    $db->close();
    
    echo json_encode([
        'streams' => $streams,
        'reflector' => $reflector,
        'connected' => $connected,
        'blocked' => $blocked,
        'timestamp' => date('Y-m-d H:i:s'),
        'status' => 'ok'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

Dar permisos:
```bash
sudo chown www-data:www-data /var/www/html/api.php
sudo chmod 644 /var/www/html/api.php
# Asegurar que www-data puede leer la base de datos
sudo chmod 644 /opt/pysfreflector/collector3.db
```

#### Opción B: Python Flask (Alternativa independiente)

Crear `/opt/pysfreflector/api_server.py`:

```python
#!/usr/bin/env python3
from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Permitir peticiones desde cualquier origen

DB_PATH = '/opt/pysfreflector/collector3.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/dashboard')
def get_dashboard_data():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500
    
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

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok', 'database_exists': os.path.exists(DB_PATH)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
```

Instalar dependencias y ejecutar:
```bash
sudo pip3 install flask flask-cors --break-system-packages
python3 /opt/pysfreflector/api_server.py &
```

Servicio systemd para la API Flask (`/etc/systemd/system/pysf3-api.service`):
```ini
[Unit]
Description=pYSF3 Dashboard API
After=network.target collector3.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pysfreflector
ExecStart=/usr/bin/python3 /opt/pysfreflector/api_server.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Paso 3: Configurar el Dashboard para Tiempo Real

Editar `client/src/pages/dashboard.tsx` y cambiar las variables de configuración:

```typescript
// Cambiar estas líneas al inicio del archivo:
const API_URL = 'http://tu-servidor.com/api.php'; // o '/api/dashboard' para Flask
const USE_MOCK_DATA = false; // Cambiar a false para usar datos reales
```

También necesitas añadir el código de fetch. Añadir este hook después de las variables de configuración:

```typescript
import { useState, useEffect } from 'react';

// Dentro del componente Dashboard:
const [streams, setStreams] = useState<QSOStream[]>(mockQSOData);
const [linked, setLinked] = useState<LinkedStation[]>(mockLinkedData);
const [blocked, setBlocked] = useState<BlockedStation[]>(mockBlockedData);
const [reflector, setReflector] = useState<ReflectorInfo>(mockReflectorInfo);

useEffect(() => {
  if (USE_MOCK_DATA) return;
  
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.streams) setStreams(data.streams);
      if (data.connected) setLinked(data.connected);
      if (data.blocked) setBlocked(data.blocked);
      if (data.reflector) setReflector(data.reflector);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  fetchData();
  const interval = setInterval(fetchData, 60000); // Actualizar cada 60 segundos
  
  return () => clearInterval(interval);
}, []);
```

### Paso 4: Verificar la Conexión

1. Verificar que collector3.py está corriendo:
```bash
systemctl status collector3
```

2. Verificar que la base de datos tiene datos:
```bash
sqlite3 /opt/pysfreflector/collector3.db "SELECT COUNT(*) FROM streams;"
```

3. Probar la API:
```bash
curl http://localhost/api.php
# o para Flask:
curl http://localhost:5001/api/dashboard
```

4. Abrir el dashboard en el navegador y verificar que muestra datos reales.

### Configuración de CORS (si es necesario)

Si el dashboard está en un dominio diferente a la API, asegúrate de que CORS está configurado correctamente.

Para Nginx, añadir en la configuración del servidor:
```nginx
location /api.php {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type';
}
```

### Frecuencia de Actualización

Por defecto, el dashboard se actualiza cada 60 segundos. Puedes cambiar esto modificando el intervalo:

```typescript
const interval = setInterval(fetchData, 30000); // Actualizar cada 30 segundos
```

**Nota**: No uses intervalos menores a 10 segundos para evitar sobrecargar el servidor

## Estructura del Proyecto

```
pysf3-dashboard/
├── client/
│   ├── src/
│   │   ├── components/ui/    # Componentes de interfaz
│   │   ├── lib/              # Utilidades (callsignFlags, etc.)
│   │   ├── pages/            # Páginas (dashboard.tsx)
│   │   └── App.tsx           # Enrutador principal
│   └── index.html
├── attached_assets/          # Logos e imágenes
├── package.json
└── README.md
```

## Personalización

### Cambiar colores del tema

Editar `client/src/index.css` para modificar las variables CSS:

```css
:root {
  --primary: 220 90% 56%;      /* Color primario */
  --accent: 280 85% 65%;       /* Color de acento */
  --background: 222 47% 6%;    /* Fondo */
}
```

### Añadir más prefijos de indicativos

Editar `client/src/lib/callsignFlags.ts` para añadir nuevos prefijos de países.

## Solución de Problemas

### El dashboard no carga
- Verificar que Node.js está instalado: `node --version`
- Verificar que las dependencias están instaladas: `npm install`
- Revisar logs: `pm2 logs` o `journalctl -u pysf3-dashboard`

### Puerto en uso
- Cambiar el puerto en la variable de entorno PORT
- Verificar qué proceso usa el puerto: `sudo lsof -i :5000`

### Permisos denegados
- Asegurar permisos correctos: `sudo chown -R $USER:$USER /opt/pysf3-dashboard`

## Licencia

MIT License - Libre para uso personal y comercial.

## Créditos

- **ADN Systems Spain** - Desarrollo y diseño
- **pYSF3** - Software de reflector C4FM
- Iconos: [Lucide React](https://lucide.dev)
- UI Components: [shadcn/ui](https://ui.shadcn.com)

## Contacto

Para soporte o consultas, contactar con ADN Systems Spain.

---

**73 de ADN Systems Spain** 📻
