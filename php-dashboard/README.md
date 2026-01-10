# pYSF3 PHP Dashboard

Dashboard PHP simple y moderno para pYSFReflector3. Diseño oscuro, responsive y optimizado para móviles.

**Por ADN Systems Spain**

## Archivos

```
php-dashboard/
├── index.php                        # Redirección a main.php
├── main.php                         # QSO Traffic (principal)
├── linked.php                       # Estaciones conectadas
├── blocked.php                      # Indicativos bloqueados
├── ADN_Systems_EA_logo_transparente.png  # Logo (copiar aquí)
└── README.md
```

## Requisitos

- PHP 7.4+ con extensión SQLite3
- Servidor web (Apache/Nginx)
- collector3.db generada por collector3.py

## Instalación

### 1. Copiar archivos al servidor web

```bash
sudo mkdir -p /var/www/html/ysf
sudo cp *.php /var/www/html/ysf/
sudo cp ADN_Systems_EA_logo_transparente.png /var/www/html/ysf/
```

### 2. Configurar permisos

```bash
sudo chown -R www-data:www-data /var/www/html/ysf
sudo chmod 644 /var/www/html/ysf/*.php
```

### 3. Asegurar acceso a la base de datos

```bash
# Verificar que www-data puede leer la base de datos
sudo chmod 644 /opt/pysfreflector/collector3.db
```

### 4. Configurar ruta de la base de datos (si es diferente)

Editar cada archivo PHP y cambiar la ruta en esta línea:

```php
$db = new SQLite3('/opt/pysfreflector/collector3.db');
```

## Acceso

Abrir en el navegador: `http://TU_IP/ysf/`

## Características

- **Tema oscuro** - Diseño moderno Dark Tech
- **Responsive** - Optimizado para móviles y tablets
- **Banderas de país** - Automáticas según prefijo del indicativo
- **Badges de radio** - Colores según tipo (handheld, móvil, base, bridge)
- **Auto-refresh** - main.php cada 5s, linked/blocked cada 60s
- **Tarjetas móviles** - Vista de tarjetas expandibles en pantallas pequeñas

## Personalización

### Cambiar logo

Reemplazar `ADN_Systems_EA_logo_transparente.png` con tu logo.

### Cambiar colores

Editar las variables CSS en cada archivo:

```css
:root {
    --bg-dark: #0a0f1a;          /* Fondo principal */
    --bg-card: #111827;          /* Fondo de tarjetas */
    --accent-blue: #3b82f6;      /* Color de acento */
    --accent-green: #22c55e;     /* TX activo */
    --accent-red: #ef4444;       /* Timeout/bloqueado */
}
```

### Añadir más prefijos de países

Editar la función `getCountryFlag()` en cada archivo:

```php
$prefixes = [
    'EA' => 'es',  // España
    'LU' => 'ar',  // Argentina
    // Añadir más...
];
```

## Diferencias con el dashboard React

| Característica | PHP | React |
|----------------|-----|-------|
| Instalación | Simple (copiar archivos) | Requiere Node.js/build |
| Dependencias | Solo PHP + SQLite3 | Node.js, npm, React |
| Actualización | Refresh de página | Fetch automático sin refresh |
| Personalización | Editar PHP directamente | Requiere rebuild |
| Rendimiento | Ligero | Más pesado pero más fluido |

## Licencia

MIT License - Libre para uso personal y comercial.

**73 de ADN Systems Spain**
