<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="60"/>
    <title>pYSF3 C4FM Reflector - Linked Stations</title>
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
            --border-color: #1e3a5f;
            --glow-blue: rgba(59, 130, 246, 0.4);
            --glow-green: rgba(34, 197, 94, 0.4);
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
        .navbar-brand img { max-height: 55px; width: auto; filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3)); }
        @media (max-width: 576px) { .navbar-brand img { max-height: 40px; } .navbar { padding: 0.5rem 1rem; } }
        .nav-link {
            color: var(--text-secondary) !important;
            font-weight: 600;
            font-size: 0.9rem;
            padding: 0.6rem 1.2rem !important;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        .nav-link:hover { color: var(--accent-cyan) !important; background: rgba(6, 182, 212, 0.1); }
        .nav-link.active {
            color: var(--accent-blue) !important;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
            box-shadow: 0 0 15px var(--glow-blue);
        }
        .page-header { padding: 1.5rem 0 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .page-title {
            font-size: 1.75rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-green) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .counter-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 12px;
            padding: 0.75rem 1.25rem;
            box-shadow: 0 0 20px var(--glow-green);
        }
        .counter-number { font-size: 1.75rem; font-weight: 700; color: var(--accent-green); text-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
        .counter-label { font-size: 0.85rem; color: var(--text-secondary); }
        .table-container {
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border-radius: 16px;
            border: 1px solid var(--border-color);
            overflow: hidden;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .table { margin: 0; color: var(--text-primary); font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; }
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
        .table tbody td { border-color: rgba(30, 58, 95, 0.5); padding: 0.75rem 0.6rem; vertical-align: middle; }
        .table tbody tr:hover { background: linear-gradient(90deg, rgba(34, 197, 94, 0.08) 0%, transparent 100%); }
        .callsign { font-weight: 700; color: var(--accent-cyan); text-shadow: 0 0 10px rgba(6, 182, 212, 0.3); }
        .status-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.6rem; border-radius: 8px; font-weight: 700; font-size: 0.7rem; }
        .status-active { background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 100%); color: #4ade80; box-shadow: 0 0 12px var(--glow-green); }
        .status-idle { background: linear-gradient(135deg, rgba(100, 116, 139, 0.25) 0%, rgba(100, 116, 139, 0.1) 100%); color: #94a3b8; }
        .dgid-badge {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
            color: var(--accent-blue);
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.8rem;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .flag-icon { width: 22px; height: 15px; margin-right: 6px; border-radius: 3px; vertical-align: middle; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        footer {
            background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-dark) 100%);
            border-top: 1px solid var(--border-color);
            padding: 1.5rem;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        footer strong { color: var(--text-primary); }
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
        .btn-footer:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4); color: white; }
        .mobile-card {
            display: none;
            background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%);
            border: 1px solid var(--border-color);
            border-left: 3px solid var(--accent-green);
            border-radius: 16px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .mobile-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); }
        .mobile-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(30, 58, 95, 0.5); }
        .mobile-card-call { font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan); }
        .mobile-card-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(30, 58, 95, 0.3); font-size: 0.9rem; }
        .mobile-card-row:last-child { border-bottom: none; }
        .mobile-card-label { color: var(--text-secondary); }
        .mobile-card-value { color: var(--text-primary); font-family: 'JetBrains Mono', monospace; }
        @media (max-width: 992px) { .table-container { display: none; } .mobile-card { display: block; } }
    </style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#"><img src="ADN_Systems_EA_logo_transparente.png" alt="ADN Systems Spain"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="./main.php">QSO Traffic</a></li>
                <li class="nav-item"><a class="nav-link active" href="./linked.php">Linked</a></li>
                <li class="nav-item"><a class="nav-link" href="./blocked.php">Blocked</a></li>
            </ul>
        </div>
    </div>
</nav>

<div class="container-fluid px-3 px-lg-4">
    <div class="page-header">
        <h1 class="page-title">Linked Stations</h1>
<?php
$db = new SQLite3('/opt/pysfreflector/collector3.db');
$totalLinked = $db->querySingle('SELECT COUNT(*) FROM connected');
?>
        <div class="counter-badge">
            <span class="counter-number"><?php echo $totalLinked; ?></span>
            <span class="counter-label">Stations Online</span>
        </div>
    </div>
    
    <div class="table-container">
        <div class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Callsign</th>
                        <th>DGID</th>
                        <th>IP Address</th>
                        <th>Port</th>
                        <th>Connected Since</th>
                        <th>Status</th>
                        <th>Back to Home</th>
                    </tr>
                </thead>
                <tbody>
<?php
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
        'JA' => 'jp', 'LU' => 'ar', 'PY' => 'br', 'CE' => 'cl', 'XE' => 'mx',
        'OE' => 'at', 'OZ' => 'dk', 'OH' => 'fi', 'SM' => 'se', 'LA' => 'no', 'SP' => 'pl', 'OK' => 'cz', 'HA' => 'hu', 'YO' => 'ro', 'LZ' => 'bg', 'SV' => 'gr', '9A' => 'hr', 'S5' => 'si',
        'UA' => 'ru', 'RU' => 'ru'
    ];
    $call = strtoupper(trim($call));
    foreach ([3, 2, 1] as $len) { $prefix = substr($call, 0, $len); if (isset($prefixes[$prefix])) return $prefixes[$prefix]; }
    return null;
}

$res = $db->query('SELECT * FROM connected ORDER BY T_HOLD, CF');
$nr = 1;
while ($row = $res->fetchArray()) {
    $diff = $row['BTH_TOUT'] - $row['BTH_TCORR'];
    $flag = getCountryFlag($row['call']);
    $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w40/{$flag}.png' alt='{$flag}'>" : "";
    $statusClass = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'status-active' : 'status-idle';
    $statusText = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? '● Active' : '○ Idle';
    echo "<tr>";
    echo "<td>{$nr}</td>";
    echo "<td>{$flagHtml}<span class='callsign'>{$row['call']}</span></td>";
    echo "<td><span class='dgid-badge'>{$row['DGID']}</span></td>";
    echo "<td>{$row['IP']}</td>";
    echo "<td>UDP:{$row['port']}</td>";
    echo "<td>{$row['CF']}</td>";
    echo "<td><span class='status-badge {$statusClass}'>{$statusText}</span></td>";
    echo "<td>{$row['BTH_DGID']} <small style='color:var(--text-muted)'>({$diff}s)</small></td>";
    echo "</tr>";
    ++$nr;
}
?>
                </tbody>
            </table>
        </div>
    </div>

<?php
$res = $db->query('SELECT * FROM connected ORDER BY T_HOLD, CF');
$nr = 1;
while ($row = $res->fetchArray()) {
    $diff = $row['BTH_TOUT'] - $row['BTH_TCORR'];
    $flag = getCountryFlag($row['call']);
    $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w40/{$flag}.png' alt='{$flag}'>" : "";
    $statusClass = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'status-active' : 'status-idle';
    $statusText = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? '● Active' : '○ Idle';
    echo "<div class='mobile-card'>";
    echo "<div class='mobile-card-header'><span class='mobile-card-call'>{$flagHtml}{$row['call']}</span><span class='status-badge {$statusClass}'>{$statusText}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>DGID</span><span class='mobile-card-value'><span class='dgid-badge'>{$row['DGID']}</span></span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>IP Address</span><span class='mobile-card-value'>{$row['IP']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Port</span><span class='mobile-card-value'>UDP:{$row['port']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Connected</span><span class='mobile-card-value'>{$row['CF']}</span></div>";
    echo "<div class='mobile-card-row'><span class='mobile-card-label'>Back to Home</span><span class='mobile-card-value'>{$row['BTH_DGID']} ({$diff}s)</span></div>";
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
</body>
</html>
