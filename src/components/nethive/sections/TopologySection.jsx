import React, { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../data/variables';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styles from '../css/tableSection.module.css';
import flowStyles from '../css/topologyFlow.module.css';

// Nodos personalizados
const CustomNode = ({ data }) => {
  return (
    <div className={`${flowStyles.customNode} ${flowStyles[data.type]}`}>
      {/* Handles para conexiones */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: '#7ae582',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#7ae582',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: '#7ae582',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#7ae582',
          width: 8,
          height: 8,
          border: '2px solid #fff',
        }}
      />
      
      <div className={flowStyles.nodeHeader}>
        <div className={flowStyles.nodeIcon}>{data.icon}</div>
        <div className={flowStyles.nodeTitle}>{data.label}</div>
      </div>
      {data.status && (
        <div className={flowStyles.nodeStatus}>
          <div className={`${flowStyles.statusDot} ${flowStyles[data.status]}`}></div>
          <span>{data.statusText}</span>
        </div>
      )}
      {data.equipment && (
        <div className={flowStyles.equipmentList}>
          {data.equipment.map((eq, idx) => (
            <div key={idx} className={flowStyles.equipment}>
              <span className={flowStyles.equipmentDot}></span>
              {eq}
            </div>
          ))}
        </div>
      )}
      {data.ports && (
        <div className={flowStyles.portStatus}>
          <span>Puertos: {data.ports.active}/{data.ports.total}</span>
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const TopologySection = ({ topologyConnections }) => {
  const ingles = useStore(isEnglish);
  const [viewMode, setViewMode] = useState('visual');
  const [backgroundImage, setBackgroundImage] = useState(`${import.meta.env.BASE_URL}/image/plano/plano.jpg`);
  const fileInputRef = React.useRef(null);

  // Handler para cargar imagen personalizada
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resetear a imagen por defecto
  const handleResetBackground = () => {
    setBackgroundImage(`${import.meta.env.BASE_URL}/image/plano/plano.jpg`);
  };

  // Definir nodos para React Flow
  const initialNodes = [
    {
      id: 'mdf-1',
      type: 'custom',
      position: { x: 600, y: 50 }, // Más centrado horizontalmente
      data: {
        label: 'MDF',
        icon: '🖥️',
        type: 'mdf',
        status: 'active',
        statusText: ingles ? 'Online' : 'En línea',
        equipment: [
          ingles ? 'Main Switch' : 'Switch Principal',
          ingles ? 'Patch Panel 48p' : 'Patch Panel 48p',
          ingles ? 'UPS Backup' : 'UPS Respaldo'
        ],
        ports: { active: 2, total: 48 }
      },
    },
    {
      id: 'idf-1',
      type: 'custom',
      position: { x: 150, y: 350 }, // Mayor separación vertical y horizontal
      data: {
        label: 'IDF 1',
        icon: '🖲️',
        type: 'idf',
        status: 'active',
        statusText: ingles ? 'Online' : 'En línea',
        equipment: [
          ingles ? 'Switch 48p' : 'Switch 48p',
          ingles ? 'Patch Panel' : 'Patch Panel'
        ],
        ports: { active: 32, total: 48 }
      },
    },
    {
      id: 'idf-2',
      type: 'custom',
      position: { x: 1050, y: 350 }, // Mayor separación horizontal
      data: {
        label: 'IDF 2',
        icon: '🖲️',
        type: 'idf',
        status: 'warning',
        statusText: ingles ? 'Warning' : 'Advertencia',
        equipment: [
          ingles ? 'Switch 48p' : 'Switch 48p',
          ingles ? 'Patch Panel' : 'Patch Panel',
          'UPS'
        ],
        ports: { active: 45, total: 48 }
      },
    },
    {
      id: 'switch-1',
      type: 'custom',
      position: { x: 50, y: 650 }, // Mayor separación vertical
      data: {
        label: ingles ? 'Access Switch A1' : 'Switch Acceso A1',
        icon: '🔌',
        type: 'switch',
        status: 'active',
        statusText: ingles ? 'Online' : 'En línea',
        ports: { active: 16, total: 24 }
      },
    },
    {
      id: 'switch-2',
      type: 'custom',
      position: { x: 350, y: 650 }, // Mayor separación horizontal y vertical
      data: {
        label: ingles ? 'Access Switch A2' : 'Switch Acceso A2',
        icon: '🔌',
        type: 'switch',
        status: 'active',
        statusText: ingles ? 'Online' : 'En línea',
        ports: { active: 20, total: 24 }
      },
    },
    {
      id: 'switch-3',
      type: 'custom',
      position: { x: 850, y: 650 }, // Mayor separación horizontal y vertical
      data: {
        label: ingles ? 'Access Switch B1' : 'Switch Acceso B1',
        icon: '🔌',
        type: 'switch',
        status: 'active',
        statusText: ingles ? 'Online' : 'En línea',
        ports: { active: 18, total: 24 }
      },
    },
    {
      id: 'switch-4',
      type: 'custom',
      position: { x: 1150, y: 650 }, // Mayor separación horizontal y vertical
      data: {
        label: ingles ? 'Access Switch B2' : 'Switch Acceso B2',
        icon: '🔌',
        type: 'switch',
        status: 'inactive',
        statusText: ingles ? 'Offline' : 'Desconectado',
        ports: { active: 0, total: 24 }
      },
    },
    {
      id: 'server-1',
      type: 'custom',
      position: { x: 600, y: 850 }, // Mucho más abajo y centrado
      data: {
        label: ingles ? 'Core Server' : 'Servidor Principal',
        icon: '🖥️',
        type: 'server',
        status: 'active',
        statusText: ingles ? 'Running' : 'Funcionando'
      },
    },
  ];

  // Definir conexiones para React Flow
  const initialEdges = [
    {
      id: 'mdf-idf1',
      source: 'mdf-1',
      target: 'idf-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 3 },
      label: 'Fibra 10Gb',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '12px' }, // Mejorado
    },
    {
      id: 'mdf-idf2',
      source: 'mdf-1',
      target: 'idf-2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#f59e0b', strokeWidth: 3 },
      label: 'Fibra 10Gb',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '12px' }, // Mejorado
    },
    {
      id: 'idf1-sw1',
      source: 'idf-1',
      target: 'switch-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      label: 'Cat6A',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '11px' }, // Mejorado
    },
    {
      id: 'idf1-sw2',
      source: 'idf-1',
      target: 'switch-2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      label: 'Cat6A',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '11px' }, // Mejorado
    },
    {
      id: 'idf2-sw3',
      source: 'idf-2',
      target: 'switch-3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      label: 'Cat6A',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '11px' }, // Mejorado
    },
    {
      id: 'idf2-sw4',
      source: 'idf-2',
      target: 'switch-4',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#6b7280', strokeWidth: 2, strokeDasharray: '5,5' },
      label: 'Desconectado',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '11px' }, // Mejorado
    },
    {
      id: 'mdf-server',
      source: 'mdf-1',
      target: 'server-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 3 },
      label: 'Dedicado',
      labelStyle: { fill: '#ffffff', fontWeight: 700, fontSize: '12px' }, // Mejorado
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const renderVisualTopology = () => (
    <div 
      className={flowStyles.flowContainer}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay para oscurecer la imagen */}
      <div className={flowStyles.backgroundOverlay}></div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineStyle={{ stroke: '#7ae582', strokeWidth: 2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Controls className={flowStyles.controls} />
        <MiniMap 
          className={flowStyles.minimap}
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'mdf': return '#d58b0c';
              case 'idf': return '#10b981';
              case 'switch': return '#6366f1';
              case 'server': return '#8b5cf6';
              default: return '#6b7280';
            }
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#374151"
        />
      </ReactFlow>
      
      {/* Controles de fondo */}
      <div className={flowStyles.backgroundControls}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button 
          className={flowStyles.bgButton}
          onClick={() => fileInputRef.current?.click()}
          title={ingles ? 'Upload floor plan' : 'Cargar plano'}
        >
          📁 {ingles ? 'Upload Plan' : 'Cargar Plano'}
        </button>
        <button 
          className={flowStyles.bgButton}
          onClick={handleResetBackground}
          title={ingles ? 'Reset to default' : 'Restaurar por defecto'}
        >
          🔄 {ingles ? 'Reset' : 'Restaurar'}
        </button>
      </div>
      
      {/* Leyenda */}
      <div className={flowStyles.legend}>
        <h4>{ingles ? 'Legend' : 'Leyenda'}</h4>
        <div className={flowStyles.legendItems}>
          <div className={flowStyles.legendItem}>
            <div className={`${flowStyles.legendDot} ${flowStyles.active}`}></div>
            <span>{ingles ? 'Active' : 'Activo'}</span>
          </div>
          <div className={flowStyles.legendItem}>
            <div className={`${flowStyles.legendDot} ${flowStyles.warning}`}></div>
            <span>{ingles ? 'Warning' : 'Advertencia'}</span>
          </div>
          <div className={flowStyles.legendItem}>
            <div className={`${flowStyles.legendDot} ${flowStyles.inactive}`}></div>
            <span>{ingles ? 'Offline' : 'Desconectado'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>{ingles ? 'From' : 'Origen'}</th>
            <th>{ingles ? 'To' : 'Destino'}</th>
            <th>{ingles ? 'Connection Type' : 'Tipo Conexión'}</th>
            <th>{ingles ? 'Status' : 'Estado'}</th>
            <th>{ingles ? 'Bandwidth' : 'Ancho de Banda'}</th>
            <th>{ingles ? 'Actions' : 'Acciones'}</th>
          </tr>
        </thead>
        <tbody>
          {topologyConnections.map((conn, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>
                <div className={styles.nodeCell}>
                  <span className={styles.nodeIcon}>🖥️</span>
                  {conn.from}
                </div>
              </td>
              <td>
                <div className={styles.nodeCell}>
                  <span className={styles.nodeIcon}>🖲️</span>
                  {conn.to}
                </div>
              </td>
              <td>
                <span className={styles.connectionType}>{conn.tipo}</span>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${conn.estado === 'Activo' ? styles.activo : styles.inactivo}`}>
                  {conn.estado}
                </span>
              </td>
              <td>{conn.ancho_banda}</td>
              <td>
                <div className={styles.actionButtons}>
                  <button className={styles.actionBtn}>📊</button>
                  <button className={styles.actionBtn}>🔧</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h3>{ingles ? 'Network Topology' : 'Topología de Red'}</h3>
        <div className={flowStyles.viewControls}>
          <button 
            className={`${flowStyles.viewButton} ${viewMode === 'visual' ? flowStyles.active : ''}`}
            onClick={() => setViewMode('visual')}
          >
            🌐 {ingles ? 'Visual Map' : 'Mapa Visual'}
          </button>
          <button 
            className={`${flowStyles.viewButton} ${viewMode === 'table' ? flowStyles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            📋 {ingles ? 'Data Table' : 'Tabla de Datos'}
          </button>
          <button className={styles.addButton}>
            + {ingles ? 'Add Connection' : 'Agregar Conexión'}
          </button>
        </div>
      </div>
      
      {viewMode === 'visual' ? renderVisualTopology() : renderTableView()}
    </div>
  );
};

export default TopologySection;