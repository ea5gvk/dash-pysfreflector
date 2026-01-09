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
- **Node.js:** v18.x o superior
- **npm:** v9.x o superior
- **RAM:** 512 MB mínimo
- **Disco:** 500 MB espacio libre

## Instalación en Debian

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

El dashboard lee datos del archivo JSON generado por el script `collector3.py` del reflector pYSF3.

### Configuración del collector

El script `collector3.py` debe generar un archivo `dashboard_data.json` que el frontend consumirá.

Ruta típica del archivo de datos:
```
/var/www/html/dashboard_data.json
```

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
