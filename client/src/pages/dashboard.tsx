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
  ChevronDown,
  Smartphone,
  Car,
  Monitor,
  Link2,
  Zap
} from 'lucide-react';
import { getFlagEmoji, getCountryName } from '@/lib/callsignFlags';
import adnLogo from '@assets/ADN_Systems_EA_logo_transparente_1767983339225.png';

type RadioType = 'handheld' | 'mobile' | 'base' | 'bridge' | 'unknown';

interface RadioInfo {
  type: RadioType;
  icon: typeof Smartphone;
  color: string;
  bgColor: string;
  label: string;
}

function getRadioInfo(radioCode: string): RadioInfo {
  const code = radioCode.toUpperCase().replace(/[-\s]/g, '');
  
  const handhelds = ['FT70D', 'FT3D', 'FT2D', 'FT5D', 'FT1XD', 'FT1D'];
  const mobiles = ['FTM400', 'FTM300', 'FTM300D', 'FTM500', 'FTM500D', 'FTM200', 'FTM100', 'FTM510', 'FTM310', 'FT7250', 'FT3207', 'FTM3200'];
  const bases = ['FT991', 'FT991A', 'FT897', 'FT857', 'FTDX10', 'FTDX101'];
  const bridges = ['BM', 'XLX', 'BLUEDV', 'MMDVM', 'DVMEGA', 'OPENSPOT', 'HOTSPOT'];
  
  if (handhelds.some(h => code.includes(h))) {
    return {
      type: 'handheld',
      icon: Smartphone,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      label: 'Handheld'
    };
  }
  
  if (mobiles.some(m => code.includes(m))) {
    return {
      type: 'mobile',
      icon: Car,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      label: 'Mobile'
    };
  }
  
  if (bases.some(b => code.includes(b))) {
    return {
      type: 'base',
      icon: Monitor,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      label: 'Base Station'
    };
  }
  
  if (bridges.some(br => code.includes(br))) {
    return {
      type: 'bridge',
      icon: Link2,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      label: 'Bridge/Link'
    };
  }
  
  return {
    type: 'unknown',
    icon: Radio,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    label: 'Radio'
  };
}

function RadioBadge({ radioCode }: { radioCode: string }) {
  const info = getRadioInfo(radioCode);
  const Icon = info.icon;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${info.bgColor}`}>
        <Icon className={`w-4 h-4 ${info.color}`} />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-sm font-medium">{radioCode}</span>
        <span className={`text-[10px] ${info.color}`}>{info.label}</span>
      </div>
    </div>
  );
}

function RadioBadgeCompact({ radioCode }: { radioCode: string }) {
  const info = getRadioInfo(radioCode);
  const Icon = info.icon;
  
  return (
    <div className="flex items-center gap-1.5" title={info.label}>
      <div className={`p-1 rounded ${info.bgColor}`}>
        <Icon className={`w-3.5 h-3.5 ${info.color}`} />
      </div>
      <span className="font-mono text-sm">{radioCode}</span>
    </div>
  );
}

type TabType = 'qso' | 'linked' | 'blocked';

// API Configuration - Change this URL to point to your collector3.py API endpoint
const API_URL = '/api/dashboard'; // Example: 'http://your-server:5001/api/dashboard'
const USE_MOCK_DATA = true; // Set to false when connecting to real API

// Interfaces matching collector3.py SQLite schema exactly
interface QSOStream {
  status: 'TX' | 'TC' | 'TO' | 'TD' | 'WD' | 'TB';
  stream_id: string;
  call: string;
  target: string;
  gw: string;
  dgid: string;
  gid_desc: string;
  time: string;
  CS: string;
  CM: string;
  FT: string;
  Dev: string;
  MR: string;
  VoIP: string;
  DT: string;
  SQL: string;
  SQC: string;
  latitude: string;
  longitude: string;
  aprs: string;
  radio_code: string;
  station_id: string;
  radio_id: string;
  dst: string;
  src: string;
  uplink: string;
  downlink: string;
  downlink_id: string;
  uplink_id: string;
  date_time: string;
}

interface LinkedStation {
  linked: string;
  call: string;
  IP: string;
  port: string;
  TC: string;
  CF: string;
  LO: string;
  LK: string;
  DGID: string;
  T_HOLD: string;
  BTH_DGID: string;
  BTH_TOUT: string;
  BTH_TCORR: string;
}

interface BlockedStation {
  time: string;
  call: string;
  BR: string;
  TR: string;
}

interface ReflectorInfo {
  system: string;
  ver: string;
  REF_ID: string;
  REF_NAME: string;
  REF_DESC: string;
  date_time: string;
  APRS_EN: string;
  APRS_SSID: string;
  contact: string;
  web: string;
  dgid_loc: string;
  dgid_def: string;
  dgid_list: string;
}

// Mock data matching collector3.py SQLite schema
const mockQSOData: QSOStream[] = [
  { status: 'TX', stream_id: 'A1B2C3D4', call: 'IU5JAE', target: 'ALL', gw: 'IU5JAE-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:32:15(00:45)', CS: 'IU5JAE', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '01', latitude: '43.769600', longitude: '11.255800', aprs: 'https://aprs.fi/IU5JAE-Y', radio_code: 'FT-70D', station_id: 'ABCDE', radio_id: '12345', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:32:15' },
  { status: 'TC', stream_id: 'D4E5F6G7', call: 'IK5XMK', target: 'ALL', gw: 'IK5XMK-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:31:45(01:23)', CS: 'IK5XMK', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '02', latitude: '', longitude: '', aprs: 'https://aprs.fi/IK5XMK-Y', radio_code: 'FTM400', station_id: 'FGHIJ', radio_id: '67890', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:31:45' },
  { status: 'TD', stream_id: 'G7H8I9J0', call: 'EA4GPZ', target: 'ALL', gw: 'EA4GPZ-ND', dgid: '22', gid_desc: 'MP_Italia', time: '14:30:22(00:58)', CS: 'EA4GPZ', CM: 'Group/CQ', FT: 'DN', Dev: 'Narrow', MR: '0', VoIP: '0', DT: 'Voice FR', SQL: '0', SQC: '03', latitude: '40.416700', longitude: '-3.703790', aprs: 'https://aprs.fi/EA4GPZ-Y', radio_code: 'FT-991', station_id: 'KLMNO', radio_id: '11111', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:30:22' },
  { status: 'TO', stream_id: 'J0K1L2M3', call: 'W1ABC', target: 'ALL', gw: 'W1ABC-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:29:58(05:00)', CS: 'W1ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '04', latitude: '42.360100', longitude: '-71.05890', aprs: 'https://aprs.fi/W1ABC-Y', radio_code: 'FT- 3D', station_id: 'PQRST', radio_id: '22222', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:29:58' },
  { status: 'WD', stream_id: 'M3N4O5P6', call: 'DL1ABC', target: 'DL', gw: 'DL1ABC-ND', dgid: '30', gid_desc: 'MP_Lazio', time: '14:28:33(02:15)', CS: 'DL1ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '05', latitude: '52.520000', longitude: '13.405000', aprs: 'https://aprs.fi/DL1ABC-Y', radio_code: 'FTM300', station_id: 'UVWXY', radio_id: '33333', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:28:33' },
  { status: 'TB', stream_id: 'P6Q7R8S9', call: 'JA1XYZ', target: 'ALL', gw: 'JA1XYZ-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:27:11', CS: 'JA1XYZ', CM: 'Group/CQ', FT: 'DN', Dev: 'Narrow', MR: '0', VoIP: '0', DT: 'Voice FR', SQL: '0', SQC: '06', latitude: '', longitude: '', aprs: '', radio_code: 'FT- 5D', station_id: 'ZABCD', radio_id: '44444', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:27:11' },
  { status: 'TC', stream_id: 'S9T0U1V2', call: 'F5ABC', target: 'ALL', gw: 'F5ABC-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:26:44(00:32)', CS: 'F5ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '07', latitude: '48.856600', longitude: '2.3522000', aprs: 'https://aprs.fi/F5ABC-Y', radio_code: 'FTM500', station_id: 'EFGHI', radio_id: '55555', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:26:44' },
  { status: 'TX', stream_id: 'V2W3X4Y5', call: 'VK2ABC', target: 'VK', gw: 'VK2ABC-ND', dgid: '40', gid_desc: 'MP_Emilia R.', time: '14:25:20', CS: 'VK2ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '08', latitude: '-33.86880', longitude: '151.20930', aprs: 'https://aprs.fi/VK2ABC-Y', radio_code: 'FT-70D', station_id: 'JKLMN', radio_id: '66666', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:25:20' },
  { status: 'TC', stream_id: 'W5X6Y7Z8', call: 'G4ABC', target: 'ALL', gw: 'G4ABC-ND', dgid: '9', gid_desc: 'Local_reflector', time: '14:24:05(00:28)', CS: 'G4ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '09', latitude: '51.507400', longitude: '-0.127800', aprs: 'https://aprs.fi/G4ABC-Y', radio_code: 'BM_2222', station_id: 'OPQRS', radio_id: 'E0C4W', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:24:05' },
  { status: 'TX', stream_id: 'Z8A9B0C1', call: 'ON4ABC', target: 'ALL', gw: 'ON4ABC-ND', dgid: '41', gid_desc: 'MP_Toscana', time: '14:23:18', CS: 'ON4ABC', CM: 'Group/CQ', FT: 'VW', Dev: 'Wide', MR: '0', VoIP: '0', DT: 'V/D mode 1', SQL: '0', SQC: '10', latitude: '50.850300', longitude: '4.3517000', aprs: 'https://aprs.fi/ON4ABC-Y', radio_code: 'FTM200', station_id: 'TUVWX', radio_id: '77777', dst: '', src: '', uplink: '', downlink: '', downlink_id: '', uplink_id: '', date_time: '2026-01-09 14:23:18' },
];

const mockLinkedData: LinkedStation[] = [
  { linked: '1', call: 'IU5JAE-RPT', IP: '192.168.1.***', port: '42000', TC: '58', CF: '1', LO: 'N', LK: 'N', DGID: '9', T_HOLD: 'IDLE', BTH_DGID: '9', BTH_TOUT: '300', BTH_TCORR: '120' },
  { linked: '1', call: 'IK5XMK-HS', IP: '192.168.1.***', port: '42001', TC: '45', CF: '1', LO: 'N', LK: 'N', DGID: '9', T_HOLD: 'IDLE', BTH_DGID: '9', BTH_TOUT: '300', BTH_TCORR: '200' },
  { linked: '1', call: 'EA4GPZ-BR', IP: '10.0.0.***', port: '42002', TC: '60', CF: '1', LO: 'N', LK: 'Y', DGID: '22', T_HOLD: 'ACTIVE', BTH_DGID: '22', BTH_TOUT: '600', BTH_TCORR: '450' },
  { linked: '1', call: 'W1ABC-HS', IP: '172.16.0.***', port: '42003', TC: '32', CF: '1', LO: 'Y', LK: 'N', DGID: '9', T_HOLD: 'IDLE', BTH_DGID: '9', BTH_TOUT: '300', BTH_TCORR: '280' },
  { linked: '1', call: 'DL1ABC-RPT', IP: '192.168.2.***', port: '42004', TC: '55', CF: '1', LO: 'N', LK: 'N', DGID: '30', T_HOLD: 'TX', BTH_DGID: '30', BTH_TOUT: '450', BTH_TCORR: '100' },
  { linked: '1', call: 'VK2ABC-HS', IP: '10.10.10.***', port: '42005', TC: '28', CF: '1', LO: 'N', LK: 'N', DGID: '40', T_HOLD: 'IDLE', BTH_DGID: '40', BTH_TOUT: '300', BTH_TCORR: '290' },
];

const mockBlockedData: BlockedStation[] = [
  { call: 'XX1TST', time: '2026-01-08 15:30:00', BR: 'CS', TR: 'Invalid suffix' },
  { call: 'YY2BAD', time: '2026-01-07 12:00:00', BR: 'CS', TR: 'Invalid callsign format' },
];

const mockReflectorInfo: ReflectorInfo = {
  system: 'pYSF3',
  ver: '3.2.1',
  REF_ID: '2222',
  REF_NAME: 'ADN-SPAIN',
  REF_DESC: 'ADN Systems Spain C4FM Reflector',
  date_time: '2026-01-09 08:00:00',
  APRS_EN: '1',
  APRS_SSID: '-Y',
  contact: 'info@adnsystems.es',
  web: 'www.adnsystems.es',
  dgid_loc: '9',
  dgid_def: '9',
  dgid_list: '9,22,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49'
};

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; glow: string; label: string }> = {
    TX: { bg: 'bg-green-500/20', text: 'text-green-400', glow: 'glow-success', label: 'Transmitting' },
    TC: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: '', label: 'Completed' },
    TO: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'glow-destructive', label: 'Timeout' },
    TD: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', glow: '', label: 'DGID Change' },
    WD: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', glow: 'glow-warning', label: 'Watchdog' },
    TB: { bg: 'bg-gray-500/20', text: 'text-gray-400', glow: '', label: 'Blocked' },
  };

  const config = statusConfig[status] || statusConfig.TC;

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
        data-testid={`expand-qso-${stream.stream_id}`}
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
              <div className="col-span-2">
                <span className="text-muted-foreground">Radio:</span>
                <div className="mt-1">
                  <RadioBadgeCompact radioCode={stream.radio_code} />
                </div>
              </div>
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
                data-testid={`map-link-${stream.stream_id}`}
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
  const missing = parseInt(station.BTH_TOUT) - parseInt(station.BTH_TCORR);
  
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
        data-testid={`expand-linked-${station.call}`}
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
                <img 
                  src={adnLogo} 
                  alt="ADN Systems Spain" 
                  className="h-10 sm:h-14 w-auto object-contain"
                  data-testid="header-logo"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg sm:text-xl font-bold text-gradient">
                  pYSF3 Reflector
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  C4FM Multi Streams • #{mockReflectorInfo.REF_ID}
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
            { label: 'Active Streams', value: mockReflectorInfo.dgid_list.split(',').length, icon: Signal, color: 'text-purple-400' },
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
                        key={stream.stream_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`qso-row-${stream.stream_id}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={stream.status} />
                        </td>
                        <td className="py-3 px-4">
                          <CallsignWithFlag callsign={stream.call} />
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{stream.gw}</td>
                        <td className="py-3 px-4 text-sm">{stream.gid_desc}</td>
                        <td className="py-3 px-4">
                          <RadioBadge radioCode={stream.radio_code} />
                        </td>
                        <td className="py-3 px-4 text-sm">{stream.CM}</td>
                        <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{stream.time}</td>
                        <td className="py-3 px-4">
                          {stream.latitude && (
                            <a
                              href={`https://www.openstreetmap.org/?mlat=${stream.latitude}&mlon=${stream.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline text-sm"
                              data-testid={`map-btn-${stream.stream_id}`}
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
                  <MobileCard key={stream.stream_id} stream={stream} />
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
                        key={station.call}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`linked-row-${station.call}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{index + 1}</td>
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
                  <LinkedCard key={station.call} station={station} />
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
                        key={station.call}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        data-testid={`blocked-row-${station.call}`}
                      >
                        <td className="py-3 px-4 text-sm text-muted-foreground">{index + 1}</td>
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
                  <BlockedCard key={station.call} station={station} />
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
                <span className="font-semibold text-foreground">Reflector:</span> #{mockReflectorInfo.REF_ID} •
                <span className="font-semibold text-foreground ml-2">Ver:</span> {mockReflectorInfo.ver} •
                <span className="font-semibold text-foreground ml-2">APRS:</span> {mockReflectorInfo.APRS_EN}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">Streams:</span> {mockReflectorInfo.dgid_list} •
                <span className="font-semibold text-foreground ml-2">Default:</span> {mockReflectorInfo.dgid_def}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{mockReflectorInfo.REF_DESC}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={`http://${mockReflectorInfo.web}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                data-testid="website-link"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
              <a
                href={`mailto:${mockReflectorInfo.contact}`}
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
