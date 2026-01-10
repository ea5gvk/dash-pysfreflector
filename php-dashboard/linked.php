<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="60"/>
    <title>pYSF3 C4FM Reflector - Linked Stations</title>
    <meta name="author" content="ADN Systems Spain">
    <meta name="description" content="C4FM Multi Streams Reflector Dashboard">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0a0f1a;
            --bg-card: #111827;
            --bg-header: #1a2332;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --accent-blue: #3b82f6;
            --accent-green: #22c55e;
            --accent-red: #ef4444;
            --accent-yellow: #eab308;
            --accent-purple: #a855f7;
            --border-color: #1e293b;
        }
        * { box-sizing: border-box; }
        body {
            font-family: 'Oxanium', sans-serif;
            background: var(--bg-dark);
            color: var(--text-primary);
            min-height: 100vh;
            margin: 0;
        }
        .navbar {
            background: linear-gradient(135deg, var(--bg-header) 0%, var(--bg-card) 100%) !important;
            border-bottom: 1px solid var(--border-color);
            padding: 0.5rem 1rem;
        }
        .navbar-brand img {
            max-height: 60px;
            width: auto;
        }
        @media (max-width: 576px) {
            .navbar-brand img { max-height: 45px; }
        }
        .nav-link {
            color: var(--text-secondary) !important;
            font-weight: 500;
            padding: 0.5rem 1rem !important;
            border-radius: 8px;
            transition: all 0.2s;
        }
        .nav-link:hover, .nav-link.active {
            color: var(--accent-blue) !important;
            background: rgba(59, 130, 246, 0.1);
        }
        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 1.5rem 0 1rem;
        }
        .table-container {
            background: var(--bg-card);
            border-radius: 12px;
            border: 1px solid var(--border-color);
            overflow: hidden;
            margin-bottom: 1.5rem;
        }
        .table {
            margin: 0;
            color: var(--text-primary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
        }
        .table thead th {
            background: var(--bg-header);
            color: var(--text-secondary);
            font-weight: 600;
            border: none;
            padding: 0.75rem 0.5rem;
            white-space: nowrap;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .table tbody td {
            border-color: var(--border-color);
            padding: 0.6rem 0.5rem;
            vertical-align: middle;
        }
        .table tbody tr:hover {
            background: rgba(59, 130, 246, 0.05);
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.75rem;
        }
        .status-active { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .status-idle { background: rgba(100, 116, 139, 0.2); color: #64748b; }
        .dgid-badge {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
        }
        footer {
            background: var(--bg-card);
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            text-align: center;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        footer strong { color: var(--text-primary); }
        .btn-footer {
            background: var(--accent-blue);
            color: white;
            border: none;
            padding: 0.4rem 1rem;
            border-radius: 6px;
            font-size: 0.8rem;
            margin: 0.25rem;
        }
        .btn-footer:hover { background: #2563eb; color: white; }
        .mobile-card {
            display: none;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 0.75rem;
        }
        .mobile-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }
        .mobile-card-call {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--accent-blue);
        }
        .mobile-card-row {
            display: flex;
            justify-content: space-between;
            padding: 0.3rem 0;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.85rem;
        }
        .mobile-card-row:last-child { border-bottom: none; }
        .mobile-card-label { color: var(--text-secondary); }
        .mobile-card-value { color: var(--text-primary); font-family: 'JetBrains Mono', monospace; }
        @media (max-width: 992px) {
            .table-container { display: none; }
            .mobile-card { display: block; }
        }
        .flag-icon {
            width: 20px;
            height: 14px;
            margin-right: 4px;
            border-radius: 2px;
            vertical-align: middle;
        }
        .counter-badge {
            background: var(--bg-header);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 0.75rem 1.25rem;
            display: inline-block;
            margin-bottom: 1rem;
        }
        .counter-number {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent-green);
        }
        .counter-label {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
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
                <li class="nav-item"><a class="nav-link" href="./main.php">QSO Traffic</a></li>
                <li class="nav-item"><a class="nav-link active" href="./linked.php">Linked Stations</a></li>
                <li class="nav-item"><a class="nav-link" href="./blocked.php">Blocked</a></li>
            </ul>
        </div>
    </div>
</nav>

<div class="container-fluid px-3 px-lg-4">
    <h1 class="page-title">Linked Stations</h1>

<?php
$db = new SQLite3('/opt/pysfreflector/collector3.db');
$countRes = $db->query('SELECT COUNT(*) as cnt FROM connected');
$countRow = $countRes->fetchArray();
$totalLinked = $countRow['cnt'];
?>
    <div class="counter-badge">
        <span class="counter-number"><?php echo $totalLinked; ?></span>
        <span class="counter-label"> stations linked</span>
    </div>
    
    <div class="table-container">
        <div class="table-responsive">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Callsign</th>
                        <th>DGID</th>
                        <th>IP</th>
                        <th>Port</th>
                        <th>Connected</th>
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
        'JA' => 'jp', 'JE' => 'jp', 'JF' => 'jp', 'JG' => 'jp', 'JH' => 'jp', 'JI' => 'jp', 'JJ' => 'jp', 'JK' => 'jp', 'JL' => 'jp', 'JM' => 'jp', 'JN' => 'jp', 'JO' => 'jp', 'JP' => 'jp', 'JQ' => 'jp', 'JR' => 'jp', 'JS' => 'jp',
        'LU' => 'ar', 'PY' => 'br', 'CE' => 'cl', 'XE' => 'mx', 'YV' => 've', 'HK' => 'co',
        'OE' => 'at', 'OZ' => 'dk', 'OH' => 'fi', 'SM' => 'se', 'LA' => 'no', 'SP' => 'pl', 'OK' => 'cz', 'HA' => 'hu', 'YO' => 'ro', 'LZ' => 'bg', 'SV' => 'gr', 'YU' => 'rs', '9A' => 'hr', 'S5' => 'si',
        'UA' => 'ru', 'RU' => 'ru', 'RA' => 'ru', 'RV' => 'ru', 'RW' => 'ru', 'RX' => 'ru', 'RZ' => 'ru'
    ];
    $call = strtoupper(trim($call));
    foreach ([3, 2, 1] as $len) {
        $prefix = substr($call, 0, $len);
        if (isset($prefixes[$prefix])) {
            return $prefixes[$prefix];
        }
    }
    return null;
}

$res = $db->query('SELECT * FROM connected ORDER BY T_HOLD, CF');
$nr = 1;
while ($row = $res->fetchArray()) {
    $diff = $row['BTH_TOUT'] - $row['BTH_TCORR'];
    $flag = getCountryFlag($row['call']);
    $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w20/{$flag}.png' alt='{$flag}'>" : "";
    $statusClass = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'status-active' : 'status-idle';
    $statusText = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'Active' : 'Idle';
    echo "<tr>";
    echo "<td>{$nr}</td>";
    echo "<td>{$flagHtml}<strong>{$row['call']}</strong></td>";
    echo "<td><span class='dgid-badge'>{$row['DGID']}</span></td>";
    echo "<td>{$row['IP']}</td>";
    echo "<td>UDP:{$row['port']}</td>";
    echo "<td>{$row['CF']}</td>";
    echo "<td><span class='status-badge {$statusClass}'>{$statusText}</span></td>";
    echo "<td>{$row['BTH_DGID']} ({$diff}s)</td>";
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
        $flagHtml = $flag ? "<img class='flag-icon' src='https://flagcdn.com/w20/{$flag}.png' alt='{$flag}'>" : "";
        $statusClass = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'status-active' : 'status-idle';
        $statusText = ($row['T_HOLD'] == 'Active' || $row['T_HOLD'] == '1') ? 'Active' : 'Idle';
        echo "<div class='mobile-card'>";
        echo "<div class='mobile-card-header'>";
        echo "<span class='mobile-card-call'>{$flagHtml}{$row['call']}</span>";
        echo "<span class='status-badge {$statusClass}'>{$statusText}</span>";
        echo "</div>";
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
    <a class="btn btn-footer" href="<?php echo 'http://'.$row['web']; ?>">Website</a>
    <a class="btn btn-footer" href="<?php echo 'mailto:'.$row['contact']; ?>">Contact</a>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
