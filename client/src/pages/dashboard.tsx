import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Users, 
  Ban, 
  Activity,
  MapPin,
  Clock,
  Signal,
  Wifi,
  Globe,
  Menu,
  X,
  ExternalLink,
  Mail,
  ChevronDown
} from 'lucide-react';
import { getFlagEmoji, getCountryName } from '@/lib/callsignFlags';

type TabType = 'qso' | 'linked' | 'blocked';

interface QSOStream {
  id: number;
  status: 'TX' | 'TO' | 'TD' | 'WD' | 'TB' | 'RX';
  dgid: string;
  call: string;
  gw: string;
  gid_desc: string;
  radio_code: string;
  radio_id: string;
  target: string;
  SQC: string;
  stream_id: string;
  DT: string;
  CM: string;
  FT: string;
  Dev: string;
  time: string;
  latitude?: string;
  longitude?: string;
}

interface LinkedStation {
  id: number;
  call: string;
  DGID: string;
  IP: string;
  port: string;
  TC: string;
  CF: string;
  LO: string;
  LK: string;
  T_HOLD: string;
  BTH_DGID: string;
  BTH_TOUT: number;
  BTH_TCORR: number;
}

interface BlockedStation {
  id: number;
  call: string;
  time: string;
  BR: string;
  TR: string;
}

const mockQSOData: QSOStream[] = [
  { id: 1, status: 'TX', dgid: '00', call: 'IU5JAE', gw: 'IU5JAE-ND', gid_desc: 'Main Stream', radio_code: 'FT-70D', radio_id: '12345', target: 'ALL', SQC: '01', stream_id: 'A1B2C3', DT: 'VW', CM: 'GROUP', FT: '1/5', Dev: '2.1', time: '14:32:15', latitude: '43.7696', longitude: '11.2558' },
  { id: 2, status: 'RX', dgid: '00', call: 'IK5XMK', gw: 'IK5XMK-ND', gid_desc: 'Main Stream', radio_code: 'FTM-400', radio_id: '67890', target: 'ALL', SQC: '02', stream_id: 'D4E5F6', DT: 'VW', CM: 'GROUP', FT: '2/5', Dev: '1.8', time: '14:31:45' },
  { id: 3, status: 'TD', dgid: '01', call: 'EA4GPZ', gw: 'EA4GPZ-ND', gid_desc: 'Spain Link', radio_code: 'FT-991A', radio_id: '11111', target: 'ALL', SQC: '03', stream_id: 'G7H8I9', DT: 'DN', CM: 'GROUP', FT: '5/5', Dev: '2.4', time: '14:30:22' },
  { id: 4, status: 'TO', dgid: '00', call: 'W1ABC', gw: 'W1ABC-ND', gid_desc: 'Main Stream', radio_code: 'FT-3D', radio_id: '22222', target: 'ALL', SQC: '04', stream_id: 'J0K1L2', DT: 'VW', CM: 'GROUP', FT: '3/5', Dev: '1.5', time: '14:29:58', latitude: '42.3601', longitude: '-71.0589' },
  { id: 5, status: 'WD', dgid: '02', call: 'DL1ABC', gw: 'DL1ABC-ND', gid_desc: 'Germany Net', radio_code: 'FTM-300D', radio_id: '33333', target: 'DL', SQC: '05', stream_id: 'M3N4O5', DT: 'VW', CM: 'GROUP', FT: '4/5', Dev: '2.0', time: '14:28:33' },
  { id: 6, status: 'TB', dgid: '00', call: 'JA1XYZ', gw: 'JA1XYZ-ND', gid_desc: 'Main Stream', radio_code: 'FT-5D', radio_id: '44444', target: 'ALL', SQC: '06', stream_id: 'P6Q7R8', DT: 'DN', CM: 'GROUP', FT: '5/5', Dev: '1.9', time: '14:27:11' },
  { id: 7, status: 'RX', dgid: '00', call: 'F5ABC', gw: 'F5ABC-ND', gid_desc: 'Main Stream', radio_code: 'FTM-500D', radio_id: '55555', target: 'ALL', SQC: '07', stream_id: 'S9T0U1', DT: 'VW', CM: 'GROUP', FT: '2/5', Dev: '2.2', time: '14:26:44' },
  { id: 8, status: 'TX', dgid: '03', call: 'VK2ABC', gw: 'VK2ABC-ND', gid_desc: 'Oceania', radio_code: 'FT-70D', radio_id: '66666', target: 'VK', SQC: '08', stream_id: 'V2W3X4', DT: 'VW', CM: 'GROUP', FT: '1/5', Dev: '1.7', time: '14:25:20', latitude: '-33.8688', longitude: '151.2093' },
];

const mockLinkedData: LinkedStation[] = [
  { id: 1, call: 'IU5JAE-RPT', DGID: '00 (Main)', IP: '192.168.1.100', port: '42000', TC: '58', CF: '2024-01-09 10:00:00', LO: 'N', LK: 'N', T_HOLD: 'IDLE', BTH_DGID: '00', BTH_TOUT: 300, BTH_TCORR: 120 },
  { id: 2, call: 'IK5XMK-HS', DGID: '00 (Main)', IP: '192.168.1.101', port: '42001', TC: '45', CF: '2024-01-09 09:30:00', LO: 'N', LK: 'N', T_HOLD: 'IDLE', BTH_DGID: '00', BTH_TOUT: 300, BTH_TCORR: 200 },
  { id: 3, call: 'EA4GPZ-BR', DGID: '01 (Spain)', IP: '10.0.0.50', port: '42002', TC: '60', CF: '2024-01-09 08:15:00', LO: 'N', LK: 'Y', T_HOLD: 'ACTIVE', BTH_DGID: '01', BTH_TOUT: 600, BTH_TCORR: 450 },
  { id: 4, call: 'W1ABC-HS', DGID: '00 (Main)', IP: '172.16.0.25', port: '42003', TC: '32', CF: '2024-01-09 07:45:00', LO: 'Y', LK: 'N', T_HOLD: 'IDLE', BTH_DGID: '00', BTH_TOUT: 300, BTH_TCORR: 280 },
  { id: 5, call: 'DL1ABC-RPT', DGID: '02 (Germany)', IP: '192.168.2.100', port: '42004', TC: '55', CF: '2024-01-09 06:00:00', LO: 'N', LK: 'N', T_HOLD: 'TX', BTH_DGID: '02', BTH_TOUT: 450, BTH_TCORR: 100 },
  { id: 6, call: 'VK2ABC-HS', DGID: '03 (Oceania)', IP: '10.10.10.10', port: '42005', TC: '28', CF: '2024-01-09 05:30:00', LO: 'N', LK: 'N', T_HOLD: 'IDLE', BTH_DGID: '03', BTH_TOUT: 300, BTH_TCORR: 290 },
];

const mockBlockedData: BlockedStation[] = [
  { id: 1, call: 'XX1TST', time: '2024-01-08 15:30:00', BR: 'Spam transmission', TR: '2024-01-09 15:30:00' },
  { id: 2, call: 'YY2BAD', time: '2024-01-07 12:00:00', BR: 'Invalid callsign', TR: '2024-01-08 12:00:00' },
];

const reflectorInfo = {
  REF_ID: '2222',
  ver: '3.2.1',
  REF_DESC: 'Gruppo Radio Firenze C4FM Reflector',
  APRS_EN: 'Yes',
  dgid_list: '00,01,02,03',
  dgid_def: '00',
  dgid_loc: '00',
  web: 'www.grupporadiofirenze.net',
  contact: 'info@grupporadiofirenze.net'
};

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; glow: string; label: string }> = {
    TX: { bg: 'bg-green-500/20', text: 'text-green-400', glow: 'glow-success', label: 'Transmitting' },
    RX: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: 'glow-info', label: 'Receiving' },
    TO: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'glow-destructive', label: 'Timeout' },
    TD: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', glow: 'glow-info', label: 'Term Data' },
    WD: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', glow: 'glow-warning', label: 'Watchdog' },
    TB: { bg: 'bg-gray-500/20', text: 'text-gray-400', glow: '', label: 'Blocked' },
  };

  const config = statusConfig[status] || statusConfig.RX;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ${config.glow}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}

function CallsignWithFlag({ callsign }: { callsign: string }) {
  const flag = getFlagEmoji(callsign);
  const country = getCountryName(callsign);
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl" title={country}>{flag}</span>
      <span className="font-mono font-semibold text-foreground">{callsign}</span>
    </div>
  );
}

function MobileCard({ stream }: { stream: QSOStream }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <CallsignWithFlag callsign={stream.call} />
        <StatusBadge status={stream.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Signal className="w-4 h-4" />
          <span>DG-ID: {stream.dgid}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{stream.time}</span>
        </div>
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        data-testid={`expand-qso-${stream.id}`}
      >
        {expanded ? 'Less details' : 'More details'}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-border/30">
              <div><span className="text-muted-foreground">Gateway:</span> {stream.gw}</div>
              <div><span className="text-muted-foreground">Radio:</span> {stream.radio_code}</div>
              <div><span className="text-muted-foreground">Target:</span> {stream.target}</div>
              <div><span className="text-muted-foreground">Mode:</span> {stream.CM}</div>
              <div><span className="text-muted-foreground">Frame:</span> {stream.FT}</div>
              <div><span className="text-muted-foreground">Dev:</span> {stream.Dev}</div>
            </div>
            {stream.latitude && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${stream.latitude}&mlon=${stream.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                data-testid={`map-link-${stream.id}`}
              >
                <MapPin className="w-4 h-4" />
                View on map
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LinkedCard({ station }: { station: LinkedStation }) {
  const [expanded, setExpanded] = useState(false);
  const missing = station.BTH_TOUT - station.BTH_TCORR;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <CallsignWithFlag callsign={station.call.split('-')[0]} />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          station.T_HOLD === 'TX' ? 'bg-green-500/20 text-green-400' :
          station.T_HOLD === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {station.T_HOLD}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Signal className="w-4 h-4" />
          <span>{station.DGID}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>{station.TC}/60</span>
        </div>
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        data-testid={`expand-linked-${station.id}`}
      >
        {expanded ? 'Less details' : 'More details'}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-border/30">
              <div><span className="text-muted-foreground">IP:</span> {station.IP}</div>
              <div><span className="text-muted-foreground">Port:</span> UDP:{station.port}</div>
              <div><span className="text-muted-foreground">Muted:</span> {station.LO}</div>
              <div><span className="text-muted-foreground">Locked:</span> {station.LK}</div>
              <div><span className="text-muted-foreground">BTH:</span> {station.BTH_DGID}</div>
              <div><span className="text-muted-foreground">Missing:</span> {missing}s</div>
              <div className="col-span-2"><span className="text-muted-foreground">Connected:</span> {station.CF}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BlockedCard({ station }: { station: BlockedStation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <CallsignWithFlag callsign={station.call} />
        <Ban className="w-5 h-5 text-red-400" />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Blocked: {station.time}</span>
        </div>
        <div className="text-red-400">
          Reason: {station.BR}
        </div>
        <div className="text-muted-foreground">
          Release: {station.TR}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('qso');
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'qso' as TabType, label: 'QSO Traffic', icon: Activity, count: mockQSOData.length },
    { id: 'linked' as TabType, label: 'Linked Stations', icon: Wifi, count: mockLinkedData.length },
    { id: 'blocked' as TabType, label: 'Blocked', icon: Ban, count: mockBlockedData.length },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
                  <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background" />
              </div>
              <div>
                <h1 className="font-display text-lg sm:text-xl font-bold text-gradient">
                  pYSF3 Reflector
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  C4FM Multi Streams • #{reflectorInfo.REF_ID}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground glow-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-muted'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid={`mobile-tab-${tab.id}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-muted'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Active QSOs', value: mockQSOData.filter(s => s.status === 'TX').length, icon: Activity, color: 'text-green-400' },
            { label: 'Linked Stations', value: mockLinkedData.length, icon: Wifi, color: 'text-blue-400' },
            { label: 'Active Streams', value: reflectorInfo.dgid_list.split(',').length, icon: Signal, color: 'text-purple-400' },
            { label: 'Blocked', value: mockBlockedData.length, icon: Ban, color: 'text-red-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-display font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'qso' && (
            <motion.div
              key="qso"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full" data-testid="qso-table">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Callsign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Gateway</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stream</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Radio</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mode</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time (UTC)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockQSOData.map((stream, index) => (
                      <motion.tr
                        key={stream.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`qso-row-${stream.id}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{stream.id}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={stream.status} />
                        </td>
                        <td className="py-3 px-4">
                          <CallsignWithFlag callsign={stream.call} />
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{stream.gw}</td>
                        <td className="py-3 px-4 text-sm">{stream.gid_desc}</td>
                        <td className="py-3 px-4 text-sm">{stream.radio_code}</td>
                        <td className="py-3 px-4 text-sm">{stream.CM}</td>
                        <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{stream.time}</td>
                        <td className="py-3 px-4">
                          {stream.latitude && (
                            <a
                              href={`https://www.openstreetmap.org/?mlat=${stream.latitude}&mlon=${stream.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline text-sm"
                              data-testid={`map-btn-${stream.id}`}
                            >
                              <MapPin className="w-4 h-4" />
                              <span className="hidden xl:inline">View</span>
                            </a>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-3">
                {mockQSOData.map((stream) => (
                  <MobileCard key={stream.id} stream={stream} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'linked' && (
            <motion.div
              key="linked"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full" data-testid="linked-table">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Callsign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">DG-ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">IP</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Port</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">0/60</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Connected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLinkedData.map((station, index) => (
                      <motion.tr
                        key={station.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`linked-row-${station.id}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{station.id}</td>
                        <td className="py-3 px-4">
                          <CallsignWithFlag callsign={station.call.split('-')[0]} />
                        </td>
                        <td className="py-3 px-4 text-sm">{station.DGID}</td>
                        <td className="py-3 px-4 font-mono text-sm">{station.IP}</td>
                        <td className="py-3 px-4 font-mono text-sm">UDP:{station.port}</td>
                        <td className="py-3 px-4 text-sm">{station.TC}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            station.T_HOLD === 'TX' ? 'bg-green-500/20 text-green-400' :
                            station.T_HOLD === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {station.T_HOLD}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{station.CF}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-3">
                {mockLinkedData.map((station) => (
                  <LinkedCard key={station.id} station={station} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'blocked' && (
            <motion.div
              key="blocked"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full" data-testid="blocked-table">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Callsign</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Blocked At</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Release Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBlockedData.map((station, index) => (
                      <motion.tr
                        key={station.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`blocked-row-${station.id}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{station.id}</td>
                        <td className="py-3 px-4">
                          <CallsignWithFlag callsign={station.call} />
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{station.time}</td>
                        <td className="py-3 px-4 text-sm text-red-400">{station.BR}</td>
                        <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{station.TR}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden space-y-3">
                {mockBlockedData.map((station) => (
                  <BlockedCard key={station.id} station={station} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Reflector:</span> #{reflectorInfo.REF_ID} •
                <span className="font-semibold text-foreground ml-2">Ver:</span> {reflectorInfo.ver} •
                <span className="font-semibold text-foreground ml-2">APRS:</span> {reflectorInfo.APRS_EN}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">Streams:</span> {reflectorInfo.dgid_list} •
                <span className="font-semibold text-foreground ml-2">Default:</span> {reflectorInfo.dgid_def}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{reflectorInfo.REF_DESC}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={`http://${reflectorInfo.web}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                data-testid="website-link"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
              <a
                href={`mailto:${reflectorInfo.contact}`}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                data-testid="email-link"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
