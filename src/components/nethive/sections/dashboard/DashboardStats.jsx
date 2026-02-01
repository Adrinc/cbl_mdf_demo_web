import React from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import StatCard from '../../StatCard';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar
} from 'recharts';
import styles from './css/dashboardStats.module.css';

const DashboardStats = ({ 
  inventoryData, 
  topologyConnections, 
  alertsData, 
  alerts, 
  onNavClick 
}) => {
  const ingles = useStore(isEnglish);

  // Estadísticas calculadas dinámicamente basadas en los datos
  const getStats = () => {
    const switches = inventoryData.filter(item => item.tipo === 'Switch').length;
    const patches = inventoryData.filter(item => item.tipo === 'Patch Panel').length;
    const connections = topologyConnections.filter(conn => conn.estado === 'Activo').length;
    const activeAlerts = alertsData.filter(alert => alert.tipo !== 'Info').length;

    return {
      switches: { value: switches, label: ingles ? "Active Switches" : "Switches Activos" },
      patches: { value: patches, label: ingles ? "Patch Panels" : "Patch Panels" },
      connections: { value: connections, label: ingles ? "Active Connections" : "Conexiones Activas" },
      alerts: { value: activeAlerts, label: ingles ? "Active Alerts" : "Alertas Activas" }
    };
  };

  const stats = getStats();

  // Datos para gráficos de tendencias (simulados pero realistas)
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 78, connections: 156 },
    { time: '04:00', cpu: 52, memory: 58, network: 82, connections: 189 },
    { time: '08:00', cpu: 68, memory: 71, network: 95, connections: 245 },
    { time: '12:00', cpu: 75, memory: 68, network: 88, connections: 298 },
    { time: '16:00', cpu: 82, memory: 74, network: 92, connections: 325 },
    { time: '20:00', cpu: 59, memory: 66, network: 79, connections: 267 },
    { time: '24:00', cpu: 48, memory: 61, network: 73, connections: 198 }
  ];

  // Datos para distribución de dispositivos
  const deviceDistribution = [
    { name: ingles ? 'Switches' : 'Switches', value: stats.switches.value, color: '#3b82f6' },
    { name: ingles ? 'Patch Panels' : 'Patch Panels', value: stats.patches.value, color: '#10b981' },
    { name: ingles ? 'Servers' : 'Servidores', value: 8, color: '#8b5cf6' },
    { name: ingles ? 'Workstations' : 'Estaciones', value: 45, color: '#f59e0b' }
  ];

  // Datos para el estado de puertos
  const portStatusData = [
    { name: ingles ? 'Active' : 'Activos', value: 85, color: '#10b981' },
    { name: ingles ? 'Standby' : 'En Espera', value: 12, color: '#f59e0b' },
    { name: ingles ? 'Inactive' : 'Inactivos', value: 3, color: '#6b7280' }
  ];

  // Datos para tráfico de red por tipo
  const trafficData = [
    { category: ingles ? 'HTTP/HTTPS' : 'HTTP/HTTPS', value: 45, maxValue: 100 },
    { category: ingles ? 'Database' : 'Base de Datos', value: 28, maxValue: 100 },
    { category: ingles ? 'File Transfer' : 'Transferencia', value: 15, maxValue: 100 },
    { category: ingles ? 'Email' : 'Correo', value: 8, maxValue: 100 },
    { category: ingles ? 'Other' : 'Otros', value: 4, maxValue: 100 }
  ];

  // Colores personalizados para los gráficos
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('cpu') || entry.dataKey.includes('memory') || entry.dataKey.includes('network') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Stats Cards usando el componente reutilizable */}
      <div className={styles.statsGrid}>
        <StatCard
          icon="🔌"
          value={stats.switches.value}
          label={stats.switches.label}
          color="#2563eb"
          trend={{ type: 'up', value: '+2' }}
          onClick={() => onNavClick('inventory')}
        />
        <StatCard
          icon="📋"
          value={stats.patches.value}
          label={stats.patches.label}
          color="#059669"
          onClick={() => onNavClick('inventory')}
        />
        <StatCard
          icon="🔗"
          value={stats.connections.value}
          label={stats.connections.label}
          color="#0891b2"
          trend={{ type: 'up', value: '98%' }}
          onClick={() => onNavClick('topology')}
        />
        <StatCard
          icon="⚠️"
          value={stats.alerts.value}
          label={stats.alerts.label}
          color="#dc2626"
          trend={{ type: 'down', value: '-1' }}
          onClick={() => onNavClick('alerts')}
        />
      </div>

      {/* Gráficos Principales */}
      <div className={styles.chartsGrid}>
        
        {/* Gráfico de Rendimiento en Tiempo Real */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'System Performance (24h)' : 'Rendimiento del Sistema (24h)'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#e2e8f0" fontSize={12} />
              <YAxis stroke="#e2e8f0" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone"
                dataKey="cpu" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorCpu)"
                name={ingles ? 'CPU %' : 'CPU %'}
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorMemory)"
                name={ingles ? 'Memory %' : 'Memoria %'}
              />
              <Area 
                type="monotone" 
                dataKey="network" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorNetwork)"
                name={ingles ? 'Network %' : 'Red %'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Conexiones Activas */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'Active Connections Trend' : 'Tendencia de Conexiones Activas'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#e2e8f0" fontSize={12} />
              <YAxis stroke="#e2e8f0" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="connections" 
                stroke="#7ae582" 
                strokeWidth={3}
                dot={{ fill: '#7ae582', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#7ae582', strokeWidth: 2 }}
                name={ingles ? 'Connections' : 'Conexiones'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Dispositivos */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'Device Distribution' : 'Distribución de Dispositivos'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de Puertos */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'Port Status Overview' : 'Estado General de Puertos'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={portStatusData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              {portStatusData.map((entry, index) => (
                <RadialBar key={`bar-${index}`} dataKey="value" fill={entry.color} />
              ))}
              <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Tráfico de Red por Categoría */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'Network Traffic by Type' : 'Tráfico de Red por Tipo'}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#e2e8f0" fontSize={12} />
              <YAxis dataKey="category" type="category" stroke="#e2e8f0" fontSize={12} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métricas de Red en Tiempo Real */}
        <div className={styles.chartCard}>
          <h4>{ingles ? 'Real-time Network Metrics' : 'Métricas de Red en Tiempo Real'}</h4>
          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <div className={styles.metricValue}>850</div>
              <div className={styles.metricLabel}>{ingles ? 'Mbps Throughput' : 'Mbps Rendimiento'}</div>
              <div className={styles.metricTrend}>↗️ +5.2%</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>2.1</div>
              <div className={styles.metricLabel}>{ingles ? 'ms Latency' : 'ms Latencia'}</div>
              <div className={styles.metricTrend}>↘️ -0.3ms</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>99.9</div>
              <div className={styles.metricLabel}>{ingles ? '% Uptime' : '% Tiempo Activo'}</div>
              <div className={styles.metricTrend}>✅ {ingles ? 'Excellent' : 'Excelente'}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>0.02</div>
              <div className={styles.metricLabel}>{ingles ? '% Packet Loss' : '% Pérdida Paquetes'}</div>
              <div className={styles.metricTrend}>✅ {ingles ? 'Optimal' : 'Óptimo'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      {alerts && alerts.length > 0 && (
        <div className={styles.alertsPanel}>
          <h3>{ingles ? 'Recent Alerts' : 'Alertas Recientes'}</h3>
          {alerts.map(alert => (
            <div key={alert.id} className={`${styles.alert} ${styles[alert.type]}`}>
              {alert.message}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DashboardStats;
