<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>pYSF3 C4FM Reflector - QSO Traffic</title>
    <meta name="author" content="ADN Systems Spain">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0a0e17;
            --bg-card: #0f1629;
            --bg-header: #141c2f;
            --bg-elevated: #1a2342;
            --text-primary: #e2e8f0;
            --text-secondary: #64748b;
            --text-muted: #475569;
            --accent-blue: #3b82f6;
            --accent-cyan: #06b6d4;
            --accent-green: #22c55e;
            --accent-red: #ef4444;
            --accent-yellow: #eab308;
            --accent-purple: #a855f7;
            --accent-pink: #ec4899;
            --border-color: #1e3a5f;
            --glow-blue: rgba(59, 130, 246, 0.4);
            --glow-green: rgba(34, 197, 94, 0.4);
            --glow-red: rgba(239, 68, 68, 0.4);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Oxanium', sans-serif;
            background: var(--bg-dark);
            background-image: 
                radial-gradient(ellipse at 20% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(168, 85, 247, 0.06) 0%, transparent 50%);
            color: var(--text-primary);
            min-height: 100vh;
        }
        .navbar {
            background: linear-gradient(180deg, var(--bg-header) 0%, var(--bg-card) 100%) !important;
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            padding: 0.75rem 1.5rem;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        .navbar-brand img {
            max-height: 100px;
            width: auto;
            filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.5));
        }
        @media (max-width: 576px) {
            .navbar-brand img { max-height: 70px; }
            .navbar { padding: 0.5rem 1rem; }
        }
        .nav-link {
            color: var(--text-secondary) !important;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 0.6rem 1.2rem !important;
            border-radius: 10px;
            transition: all 0.3s ease;
            position: relative;
        }
        .nav-link:hover {
            color: var(--accent-cyan) !important;
            background: rgba(6, 182, 212, 0.1);
            transform: translateY(-1px);
        }
        .nav-link.active {
            color: var(--accent-blue) !important;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
            box-shadow: 0 0 15px var(--glow-blue), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .page-header {
            padding: 1.5rem 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .page-title {
            font-size: 1.75rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-cyan) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
        }
        .live-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--accent-green);
            box-shadow: 0 0 15px var(--glow-green);
        }
        .live-dot {
            width: 8px;
            height: 8px;
            background: var(--accent-green);
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 10px var(--accent-green);
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
        }
        .table-container {
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border-radius: 16px;
            border: 1px solid var(--border-color);
            overflow: hidden;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.03);
        }
        .table {
            margin: 0;
            color: var(--text-primary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.95rem;
        }
        .table thead th {
            background: linear-gradient(180deg, var(--bg-header) 0%, var(--bg-elevated) 100%);
            color: var(--text-secondary);
            font-weight: 600;
            border: none;
            padding: 1rem 0.6rem;
            white-space: nowrap;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .table tbody td {
            border-color: rgba(30, 58, 95, 0.5);
            padding: 0.75rem 0.6rem;
            vertical-align: middle;
            transition: background 0.2s;
        }
        .table tbody tr {
            transition: all 0.2s ease;
        }
        .table tbody tr:hover {
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%);
            transform: scale(1.002);
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.35rem 0.6rem;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-tx {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 100%);
            color: #4ade80;
            box-shadow: 0 0 12px var(--glow-green), inset 0 1px 0 rgba(255,255,255,0.1);
            animation: glowPulse 2s infinite;
        }
        @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 12px var(--glow-green); }
            50% { box-shadow: 0 0 20px var(--glow-green), 0 0 30px rgba(34, 197, 94, 0.2); }
        }
        .status-tc { background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%); color: #60a5fa; }
        .status-to { background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.1) 100%); color: #f87171; box-shadow: 0 0 10px var(--glow-red); }
        .status-td { background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.1) 100%); color: #c084fc; }
        .status-wd { background: linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(234, 179, 8, 0.1) 100%); color: #facc15; }
        .status-tb { background: linear-gradient(135deg, rgba(100, 116, 139, 0.25) 0%, rgba(100, 116, 139, 0.1) 100%); color: #94a3b8; }
        .callsign {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--accent-cyan);
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
        .radio-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 600;
            border: 1px solid;
        }
        .radio-handheld { background: rgba(34, 197, 94, 0.15); color: #4ade80; border-color: rgba(34, 197, 94, 0.3); }
        .radio-mobile { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
        .radio-base { background: rgba(168, 85, 247, 0.15); color: #c084fc; border-color: rgba(168, 85, 247, 0.3); }
        .radio-bridge { background: rgba(234, 179, 8, 0.15); color: #facc15; border-color: rgba(234, 179, 8, 0.3); }
        .dgid-badge {
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
            color: var(--accent-cyan);
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.75rem;
            border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .btn-map {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
            color: var(--accent-blue);
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 0.25rem 0.6rem;
            font-size: 0.7rem;
            font-weight: 600;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.3s;
        }
        .btn-map:hover {
            background: var(--accent-blue);
            color: white;
            box-shadow: 0 0 15px var(--glow-blue);
            transform: translateY(-1px);
        }
        .flag-icon {
            width: 28px;
            height: 20px;
            margin-right: 8px;
            border-radius: 4px;
            vertical-align: middle;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
        footer {
            background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-dark) 100%);
            border-top: 1px solid var(--border-color);
            padding: 1.5rem;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        footer strong { color: var(--text-primary); }
        footer p { margin: 0.3rem 0; }
        .btn-footer {
            background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%);
            color: white;
            border: none;
            padding: 0.5rem 1.25rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            margin: 0.5rem 0.25rem;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }
        .btn-footer:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
            color: white;
        }
        .mobile-card {
            display: none;
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .mobile-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            border-color: rgba(59, 130, 246, 0.3);
        }
        .mobile-card.tx-active {
            border-left: 3px solid var(--accent-green);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2), -5px 0 20px rgba(34, 197, 94, 0.1);
        }
        .mobile-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid rgba(30, 58, 95, 0.5);
        }
        .mobile-card-call {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--accent-cyan);
            text-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }
        .mobile-card-call .flag-icon {
            width: 32px;
            height: 22px;
        }
        .mobile-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.6rem 0;
            border-bottom: 1px solid rgba(30, 58, 95, 0.3);
            font-size: 1rem;
        }
        .mobile-card-row:last-child { border-bottom: none; }
        .mobile-card-label { color: var(--text-secondary); font-weight: 500; }
        .mobile-card-value { color: var(--text-primary); font-family: 'JetBrains Mono', monospace; }
        @media (max-width: 992px) {
            .table-container { display: none; }
            .mobile-card { display: block; }
        }
        .stats-bar {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }
        .stat-item {
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        .stat-icon.blue { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%); color: var(--accent-blue); }
        .stat-icon.green { background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%); color: var(--accent-green); }
        .stat-number { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
        .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="ADN_Systems_EA_logo_transparente.png" alt="ADN Systems Spain">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link active" href="./main.php">QSO Traffic</a></li>
                <li class="nav-item"><a class="nav-link" href="./linked.php">Linked</a></li>
                <li class="nav-item"><a class="nav-link" href="./blocked.php">Blocked</a></li>
            </ul>
        </div>
    </div>
</nav>

<div class="container-fluid px-3 px-lg-4">
    <div class="page-header">
        <h1 class="page-title">QSO Traffic</h1>
        <div class="live-badge">
            <span class="live-dot"></span>
            LIVE - Auto-refresh 2s
        </div>
    </div>

<?php
$db = new SQLite3('/opt/pysfreflector/collector3.db');

$txCount = $db->querySingle("SELECT COUNT(*) FROM streams WHERE status = 'TX'");
$totalCount = $db->querySingle("SELECT COUNT(*) FROM streams");
?>
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-icon green">📡</div>
            <div>
                <div class="stat-number"><?php echo $txCount ?: 0; ?></div>
                <div class="stat-label">Active TX</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon blue">📊</div>
            <div>
                <div class="stat-number"><?php echo min($totalCount, 30); ?></div>
                <div class="stat-label">Recent QSOs</div>
            </div>
        </div>
    </div>
    
    <div class="table-container">
        <div class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Callsign</th>
                        <th>Gateway</th>
                        <th>DGID</th>
                        <th>Radio</th>
                        <th>Target</th>
                        <th>Time</th>
                        <th>Map</th>
                    </tr>
                </thead>
                <tbody>
<?php
$res = $db->query('SELECT * FROM streams ORDER BY date_time DESC LIMIT 30');
$nr = 1;

function getStatusClass($status) {
    $classes = ['TX' => 'status-tx', 'TC' => 'status-tc', 'TO' => 'status-to', 'TD' => 'status-td', 'WD' => 'status-wd', 'TB' => 'status-tb'];
    return $classes[$status] ?? 'status-tc';
}

function getRadioClass($radio) {
    $handhelds = ['FT-70D', 'FT-1XD', 'FT- 2D', 'FT- 3D', 'FT- 5D'];
    $mobiles = ['FTM100', 'FTM200', 'FTM300', 'FTM400', 'FTM500', 'FTM510', 'FTM310', 'FT3207', 'FT7250', 'FTM3200'];
    $bases = ['FT-991'];
    if (in_array($radio, $handhelds)) return 'radio-handheld';
    if (in_array($radio, $mobiles)) return 'radio-mobile';
    if (in_array($radio, $bases)) return 'radio-base';
    if (strpos($radio, 'Link') !== false || strpos($radio, 'BM') !== false || strpos($radio, 'BlueDV') !== false) return 'radio-bridge';
    return 'radio-mobile';
}

function getCountryFlag($call) {
    $prefixes = [
        'EA' => 'es', 'EB' => 'es', 'EC' => 'es', 'ED' => 'es', 'EE' => 'es', 'EF' => 'es', 'EG' => 'es', 'EH' => 'es',
        'I' => 'it', 'IK' => 'it', 'IU' => 'it', 'IW' => 'it', 'IZ' => 'it',
        'F' => 'fr', 'G' => 'gb', 'M' => 'gb', '2E' => 'gb',
        'DL' => 'de', 'DO' => 'de', 'DA' => 'de', 'DB' => 'de', 'DC' => 'de', 'DD' => 'de', 'DF' => 'de', 'DG' => 'de', 'DH' => 'de', 'DJ' => 'de', 'DK' => 'de',
        'PA' => 'nl', 'PD' => 'nl', 'PE' => 'nl', 'PH' => 'nl', 'PI' => 'nl',
        'ON' => 'be', 'OO' => 'be', 'OR' => 'be', 'OS' => 'be', 'OT' => 'be',
        'HB' => 'ch', 'CT' => 'pt', 'CS' => 'pt',
        'K' => 'us', 'W' => 'us', 'N' => 'us', 'AA' => 'us', 'AB' => 'us', 'AC' => 'us', 'AD' => 'us', 'AE' => 'us', 'AF' => 'us', 'AG' => 'us', 'AI' => 'us', 'AJ' => 'us', 'AK' => 'us', 'AL' => 'us',
        'VE' => 'ca', 'VA' => 'ca', 'VK' => 'au', 'ZL' => 'nz',
        'JA' => 'jp', 'JE' => 'jp', 'JF' => 'jp', 'JG' => 'jp', 'JH' => 'jp', 'JI' => 'jp', 'JJ' => 'jp', 'JK' => 'jp', 'JL' => 'jp', 'JM' => 'jp', 'JN' => 'jp', 'JO' => 'jp', 'JP' => 'jp', 'JQ' => 'jp', 'JR' => 'jp', 'JS' => 'jp',
        'LU' => 'ar', 'PY' => 'br', 'CE' => 'cl', 'XE' => 'mx', 'YV' => 've', 'HK' => 'co',
        'OE' => 'at', 'OZ' => 'dk', 'OH' => 'fi', 'SM' => 'se', 'LA' => 'no', 'SP' => 'pl', 'OK' => 'cz', 'HA' => 'hu', 'YO' => 'ro', 'LZ' => 'bg', 'SV' => 'gr', 'YU' => 'rs', '9A' => 'hr', 'S5' => 'si',
        'UA' => 'ru', 'RU' => 'ru', 'RA' => 'ru', 'RV' => 'ru', 'RW' => 'ru', 'RX' => 'ru', 'RZ' => 'ru'
    ];
    $call = strtoupper(trim($call));
    foreach ([3, 2, 1] as $len) {
        $prefix = substr($call, 0, $len);
        if (isset($prefixes[$prefix])) return $prefixes[$prefix];
    }
    return null;
}

while ($row = $res->fetchArray()) {
    $statusClass = getStatusClass($row['status']);
    $radioClass = getRadioClass($row['radio_code']);
    $flag = getCountryFlag($row['call']);
    $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w40/{$flag}.png' alt='{$flag}'>" : "";
    $osm = !empty($row['latitude']) ? "<a href='https://www.openstreetmap.org/?mlat={$row['latitude']}&mlon={$row['longitude']}' target='_blank' class='btn-map'>📍 Map</a>" : "";
    echo "<tr>";
    echo "<td>{$nr}</td>";
    echo "<td><span class='status-badge {$statusClass}'>{$row['status']}</span></td>";
    echo "<td>{$flagHtml}<span class='callsign'>{$row['call']}</span></td>";
    echo "<td>{$row['gw']}</td>";
    echo "<td><span class='dgid-badge'>{$row['dgid']}</span> <small style='color:var(--text-muted)'>{$row['gid_desc']}</small></td>";
    echo "<td><span class='radio-badge {$radioClass}'>{$row['radio_code']}</span></td>";
    echo "<td>{$row['target']}</td>";
    echo "<td>{$row['time']}</td>";
    echo "<td>{$osm}</td>";
    echo "</tr>";
    ++$nr;
}
?>
                </tbody>
            </table>
        </div>
    </div>

<?php
$res = $db->query('SELECT * FROM streams ORDER BY date_time DESC LIMIT 30');
$nr = 1;
while ($row = $res->fetchArray()) {
    $statusClass = getStatusClass($row['status']);
    $radioClass = getRadioClass($row['radio_code']);
    $flag = getCountryFlag($row['call']);
    $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w40/{$flag}.png' alt='{$flag}'>" : "";
    $osm = !empty($row['latitude']) ? "<a href='https://www.openstreetmap.org/?mlat={$row['latitude']}&mlon={$row['longitude']}' target='_blank' class='btn-map'>📍 View Map</a>" : "";
    $cardClass = $row['status'] === 'TX' ? 'tx-active' : '';
    echo "<div class='mobile-card {$cardClass}'>";
    echo "<div class='mobile-card-header'>";
    echo "<span class='mobile-card-call'>{$flagHtml}{$row['call']}</span>";
    echo "<span class='status-badge {$statusClass}'>{$row['status']}</span>";
    echo "</div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Gateway</span><span class='mobile-card-value'>{$row['gw']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>DGID</span><span class='mobile-card-value'><span class='dgid-badge'>{$row['dgid']}</span> {$row['gid_desc']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Radio</span><span class='mobile-card-value'><span class='radio-badge {$radioClass}'>{$row['radio_code']}</span></span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Target</span><span class='mobile-card-value'>{$row['target']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Time</span><span class='mobile-card-value'>{$row['time']}</span></div>";
    if (!empty($osm)) echo "<div class='mobile-card-row'><span class='mobile-card-label'>Location</span><span class='mobile-card-value'>{$osm}</span></div>";
    echo "</div>";
    ++$nr;
}
?>
</div>

<footer>
<?php
$res = $db->query('SELECT * FROM reflector');
$row = $res->fetchArray();
echo "<p><strong>Reflector:</strong> #{$row['REF_ID']} &bull; <strong>Ver:</strong> {$row['ver']} &bull; <strong>Desc:</strong> {$row['REF_DESC']} &bull; <strong>APRS:</strong> {$row['APRS_EN']}</p>";
echo "<p><strong>Active Streams:</strong> {$row['dgid_list']} &bull; <strong>Default:</strong> {$row['dgid_def']} &bull; <strong>Local:</strong> {$row['dgid_loc']}</p>";
?>
    <div style="margin-top: 0.75rem;">
        <a class="btn-footer" href="<?php echo 'http://'.$row['web']; ?>">🌐 Website</a>
        <a class="btn-footer" href="<?php echo 'mailto:'.$row['contact']; ?>">✉️ Contact</a>
    </div>
    <p style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted);">Developed by ADN Systems Spain • 73!</p>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
setInterval(function() {
    fetch(window.location.href)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('.container-fluid');
            const oldContent = document.querySelector('.container-fluid');
            if (newContent && oldContent) {
                oldContent.innerHTML = newContent.innerHTML;
            }
        })
        .catch(err => console.log('Refresh error:', err));
}, 2000);
</script>
</body>
</html>
