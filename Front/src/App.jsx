import { useState, useEffect, useCallback } from 'react';
import { EquipoService } from './services/equipos';
import { LigaService } from './services/ligas';
import { JugadorService } from './services/jugadores';
import EquipoList from './components/EquipoList';
import EquipoForm from './components/EquipoForm';
import './App.css';

function App() {
  // Navigation State: 'dashboard' | 'ligas' | 'equipos' | 'jugadores'
  const [activeTab, setActiveTab] = useState('equipos');
  
  // Data States
  const [equipos, setEquipos] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  
  // UX States
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', message: '' }
  
  // Equipos UI State
  const [isFormView, setIsFormView] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState(null);

  // Ligas UI State
  const [ligaNombre, setLigaNombre] = useState('');
  const [ligaPais, setLigaPais] = useState('');
  
  // Jugadores UI State
  const [jugadorNombre, setJugadorNombre] = useState('');
  const [jugadorPosicion, setJugadorPosicion] = useState('Delantero');
  const [jugadorValor, setJugadorValor] = useState('');
  const [jugadorEquipoId, setJugadorEquipoId] = useState('');

  // Logger helper
  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  }, []);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all initial data from the backend
  const loadData = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('checking');
    addLog('Cargando datos del sistema de gestión deportiva...');
    
    try {
      // 1. Fetch Ligas
      addLog('Enviando petición fetch a /api/ligas...');
      const ligasData = await LigaService.getAll();
      setLigas(ligasData);
      addLog(`Ligas cargadas con éxito (${ligasData.length} registros).`);

      // 2. Fetch Equipos
      addLog('Enviando petición fetch a /api/equipos...');
      const equiposData = await EquipoService.getAll();
      setEquipos(equiposData);
      addLog(`Equipos cargados con éxito (${equiposData.length} registros).`);

      // 3. Fetch Jugadores
      addLog('Enviando petición fetch a /api/jugadores...');
      const jugadoresData = await JugadorService.getAll();
      setJugadores(jugadoresData);
      addLog(`Jugadores cargados con éxito (${jugadoresData.length} registros).`);

      setConnectionStatus('connected');
    } catch (err) {
      setConnectionStatus('disconnected');
      addLog(`Error al conectar con la API de Spring Boot: ${err.message}.`);
      showToast('No se pudo conectar con el servidor backend', 'error');
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    let active = true;
    
    const init = async () => {
      // Yield to avoid synchronous setState warning inside the hook
      await Promise.resolve();
      if (active) {
        loadData();
      }
    };
    
    init();
    
    return () => {
      active = false;
    };
  }, [loadData]);

  // Handle Team Creation or Editing
  const handleEquipoSubmit = async (payload) => {
    setLoading(true);
    try {
      if (editingEquipo) {
        // Since backend EquipoController does not support PUT, we perform a local update fallback
        // but try to notify the user of this senior architectural decision.
        addLog(`[Simulación] Actualizando equipo ID: ${editingEquipo.id} localmente (el backend no soporta PUT /api/equipos)`);
        
        // Find league name in current list to update display
        const targetLiga = ligas.find(l => l.id === payload.ligaId);
        
        setEquipos(prev => prev.map(eq => 
          eq.id === editingEquipo.id 
            ? { 
                ...eq, 
                nombre: payload.nombre, 
                presupuesto: payload.presupuesto, 
                formacionTactica: payload.formacionTactica,
                nombreLiga: targetLiga ? targetLiga.nombre : 'Liga Modificada'
              } 
            : eq
        ));
        
        showToast(`[Mock] Equipo "${payload.nombre}" actualizado localmente (el backend no tiene PUT /api/equipos)`, 'info');
        setIsFormView(false);
        setEditingEquipo(null);
      } else {
        // Creating a new Team via real POST backend endpoint
        addLog(`Enviando petición POST a /api/equipos: ${payload.nombre}`);
        const newEquipo = await EquipoService.create(payload);
        
        // Refresh equipos list from backend to make sure we have the latest persisted data
        const updatedEquipos = await EquipoService.getAll();
        setEquipos(updatedEquipos);
        
        showToast(`Equipo "${newEquipo.nombre}" registrado con éxito`, 'success');
        setIsFormView(false);
      }
    } catch (err) {
      addLog(`Error al guardar equipo: ${err.message}`);
      showToast(`Error al guardar equipo: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Team Deletion
  const handleEquipoDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el equipo "${nombre}"?`)) {
      // Backend does not support DELETE /api/equipos. Fallback to local deletion mockup.
      addLog(`[Simulación] Eliminando equipo ID: ${id} localmente (el backend no soporta DELETE /api/equipos)`);
      setEquipos(prev => prev.filter(eq => eq.id !== id));
      showToast(`[Mock] Equipo "${nombre}" eliminado localmente (el backend no tiene DELETE /api/equipos)`, 'info');
    }
  };

  // Handle League Registration (Real backend endpoint integration)
  const handleLigaSubmit = async (e) => {
    e.preventDefault();
    if (!ligaNombre.trim() || !ligaPais.trim()) {
      showToast('Por favor, completa el nombre y el país de la liga', 'error');
      return;
    }

    setLoading(true);
    addLog(`Enviando petición POST a /api/ligas para crear liga: ${ligaNombre}`);
    try {
      const nuevaLiga = await LigaService.create({
        nombre: ligaNombre.trim(),
        pais: ligaPais.trim()
      });
      
      setLigas(prev => [...prev, nuevaLiga]);
      setLigaNombre('');
      setLigaPais('');
      showToast(`Liga "${nuevaLiga.nombre}" creada con éxito`, 'success');
    } catch (err) {
      addLog(`Error al crear liga: ${err.message}`);
      showToast(`Error al crear liga: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Player Registration (Real backend endpoint integration)
  const handleJugadorSubmit = async (e) => {
    e.preventDefault();
    if (!jugadorNombre.trim() || !jugadorValor || !jugadorEquipoId) {
      showToast('Por favor, completa todos los campos del jugador', 'error');
      return;
    }

    setLoading(true);
    const payload = {
      nombre: jugadorNombre.trim(),
      posicion: jugadorPosicion,
      valorMercado: parseFloat(jugadorValor),
      equipoId: parseInt(jugadorEquipoId)
    };

    addLog(`Enviando petición POST a /api/jugadores para registrar jugador: ${jugadorNombre}`);
    try {
      const nuevoJugador = await JugadorService.create(payload);
      
      // Reload players list
      const updatedJugadores = await JugadorService.getAll();
      setJugadores(updatedJugadores);
      
      setJugadorNombre('');
      setJugadorValor('');
      showToast(`Jugador "${nuevoJugador.nombre}" registrado con éxito`, 'success');
    } catch (err) {
      addLog(`Error al registrar jugador: ${err.message}`);
      showToast(`Error al registrar jugador: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={appWrapperStyle}>
      {/* Toast Notification */}
      {toast && (
        <div style={toastStyle(toast.type)}>
          <span>{toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <aside style={sidebarStyle}>
        <div style={logoContainerStyle}>
          <div style={logoIconStyle}>⚽</div>
          <div>
            <h1 style={logoTitleStyle}>Club Manager</h1>
            <p style={logoSubStyle}>Panel de Control</p>
          </div>
        </div>

        <nav style={navStyle}>
          <button 
            style={navItemStyle(activeTab === 'dashboard')} 
            onClick={() => { setActiveTab('dashboard'); setIsFormView(false); }}
          >
            📊 Dashboard
          </button>
          <button 
            style={navItemStyle(activeTab === 'ligas')} 
            onClick={() => { setActiveTab('ligas'); setIsFormView(false); }}
          >
            🌍 Ligas
          </button>
          <button 
            style={navItemStyle(activeTab === 'equipos')} 
            onClick={() => { setActiveTab('equipos'); }}
          >
            🛡️ Equipos
          </button>
          <button 
            style={navItemStyle(activeTab === 'jugadores')} 
            onClick={() => { setActiveTab('jugadores'); setIsFormView(false); }}
          >
            👥 Jugadores
          </button>
        </nav>

        <div style={connectionBoxStyle(connectionStatus)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={statusDotStyle(connectionStatus)}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
              {connectionStatus === 'connected' ? 'Backend Activo' : connectionStatus === 'checking' ? 'Buscando...' : 'Backend Inactivo'}
            </span>
          </div>
          <button onClick={loadData} disabled={loading} style={reloadBtnStyle}>
            🔄 Recargar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={mainContentStyle}>
        {/* Header Title Bar */}
        <header style={headerBarStyle}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}>
              {activeTab === 'dashboard' && 'Resumen General'}
              {activeTab === 'ligas' && 'Administración de Ligas'}
              {activeTab === 'equipos' && 'Administración de Equipos'}
              {activeTab === 'jugadores' && 'Administración de Jugadores'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {activeTab === 'dashboard' && 'Estadísticas del sistema y estado de conexión'}
              {activeTab === 'ligas' && 'Alta y listado de ligas de fútbol oficiales'}
              {activeTab === 'equipos' && 'Registro de plantillas, presupuestos y formaciones'}
              {activeTab === 'jugadores' && 'Fichaje de jugadores y cotización de mercado'}
            </p>
          </div>
          <div className="badge">
            <span className="badge-pulse"></span>
            React 19 + Vite + pnpm
          </div>
        </header>

        {/* Dynamic Panel Renderer */}
        <div style={{ flexGrow: 1 }}>
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Metric widgets */}
              <div style={widgetsRowStyle}>
                <div style={widgetCardStyle('var(--primary-glow)', 'var(--primary)')}>
                  <div style={widgetTitleStyle}>Ligas Activas</div>
                  <div style={widgetValueStyle}>{ligas.length}</div>
                </div>
                <div style={widgetCardStyle('rgba(16, 185, 129, 0.15)', 'var(--accent)')}>
                  <div style={widgetTitleStyle}>Equipos Registrados</div>
                  <div style={widgetValueStyle}>{equipos.length}</div>
                </div>
                <div style={widgetCardStyle('rgba(245, 158, 11, 0.15)', '#f59e0b')}>
                  <div style={widgetTitleStyle}>Jugadores Fichados</div>
                  <div style={widgetValueStyle}>{jugadores.length}</div>
                </div>
              </div>

              {/* Developer Console Logs */}
              <div className="status-panel" style={{ padding: '24px', margin: 0 }}>
                <div className="console-header">
                  <span>REGISTRO DE COMUNICACIÓN (FETCH API NATIVA)</span>
                  <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => setLogs([])}>
                    Limpiar logs
                  </button>
                </div>
                <div className="console-panel" style={{ maxHeight: '300px' }}>
                  {logs.length === 0 ? 'Sin registros de peticiones.' : logs.join('\n')}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIGAS */}
          {activeTab === 'ligas' && (
            <div style={splitLayoutStyle}>
              {/* Form panel */}
              <div style={{ flex: '1 1 320px' }}>
                <div className="status-panel" style={{ margin: 0, padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>➕ Crear Nueva Liga</h3>
                  <form onSubmit={handleLigaSubmit} style={formLayoutFields}>
                    <div>
                      <label style={labelStyle}>Nombre de la Liga</label>
                      <input
                        type="text"
                        placeholder="Ej. LaLiga, Serie A, Primera División"
                        value={ligaNombre}
                        onChange={(e) => setLigaNombre(e.target.value)}
                        style={inputFieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>País</label>
                      <input
                        type="text"
                        placeholder="Ej. España, Italia, Argentina"
                        value={ligaPais}
                        onChange={(e) => setLigaPais(e.target.value)}
                        style={inputFieldStyle}
                      />
                    </div>
                    <button type="submit" disabled={loading} style={formBtnStyle}>
                      Registrar Liga
                    </button>
                  </form>
                </div>
              </div>

              {/* List panel */}
              <div style={{ flex: '2 1 450px' }}>
                {ligas.length === 0 ? (
                  <div style={emptyContainerStyle}>No hay ligas registradas en la base de datos.</div>
                ) : (
                  <div style={listContainerStyle}>
                    <table style={miniTableStyle}>
                      <thead>
                        <tr style={tableHeaderStyle}>
                          <th style={miniThStyle}>ID</th>
                          <th style={miniThStyle}>Nombre</th>
                          <th style={miniThStyle}>País</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ligas.map((liga) => (
                          <tr key={liga.id} style={miniRowStyle}>
                            <td style={miniTdStyle}>#{liga.id}</td>
                            <td style={{ ...miniTdStyle, fontWeight: '600', color: '#fff' }}>{liga.nombre}</td>
                            <td style={miniTdStyle}>🌍 {liga.pais}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EQUIPOS (ADMIN VIEW) */}
          {activeTab === 'equipos' && (
            <div>
              {isFormView ? (
                <EquipoForm
                  onSubmit={handleEquipoSubmit}
                  initialData={editingEquipo}
                  onCancel={() => {
                    setIsFormView(false);
                    setEditingEquipo(null);
                  }}
                />
              ) : (
                <EquipoList
                  equipos={equipos}
                  onAddNew={() => {
                    setIsFormView(true);
                    setEditingEquipo(null);
                  }}
                  onEdit={(eq) => {
                    setEditingEquipo(eq);
                    setIsFormView(true);
                  }}
                  onDelete={handleEquipoDelete}
                />
              )}
            </div>
          )}

          {/* TAB 4: JUGADORES */}
          {activeTab === 'jugadores' && (
            <div style={splitLayoutStyle}>
              {/* Form panel */}
              <div style={{ flex: '1 1 320px' }}>
                <div className="status-panel" style={{ margin: 0, padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>➕ Registrar Jugador</h3>
                  <form onSubmit={handleJugadorSubmit} style={formLayoutFields}>
                    <div>
                      <label style={labelStyle}>Nombre Completo</label>
                      <input
                        type="text"
                        placeholder="Ej. Lionel Messi"
                        value={jugadorNombre}
                        onChange={(e) => setJugadorNombre(e.target.value)}
                        style={inputFieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Posición</label>
                      <select
                        value={jugadorPosicion}
                        onChange={(e) => setJugadorPosicion(e.target.value)}
                        style={inputFieldStyle}
                      >
                        <option value="Delantero">Delantero ⚽</option>
                        <option value="Mediocampista">Mediocampista 🏃‍♂️</option>
                        <option value="Defensor">Defensor 🛡️</option>
                        <option value="Arquero">Arquero 🧤</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Valor de Mercado ($)</label>
                      <input
                        type="number"
                        placeholder="Ej. 85000000"
                        value={jugadorValor}
                        onChange={(e) => setJugadorValor(e.target.value)}
                        style={inputFieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Equipo Destino</label>
                      <select
                        value={jugadorEquipoId}
                        onChange={(e) => setJugadorEquipoId(e.target.value)}
                        style={inputFieldStyle}
                      >
                        <option value="">Selecciona un equipo...</option>
                        {equipos.map((eq) => (
                          <option key={eq.id} value={eq.id}>🛡️ {eq.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" disabled={loading || equipos.length === 0} style={formBtnStyle}>
                      Fichar Jugador
                    </button>
                    {equipos.length === 0 && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>
                        * Debes registrar al menos un equipo antes de fichar jugadores.
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* List panel */}
              <div style={{ flex: '2 1 450px' }}>
                {jugadores.length === 0 ? (
                  <div style={emptyContainerStyle}>No hay jugadores registrados en la base de datos.</div>
                ) : (
                  <div style={listContainerStyle}>
                    <table style={miniTableStyle}>
                      <thead>
                        <tr style={tableHeaderStyle}>
                          <th style={miniThStyle}>Nombre</th>
                          <th style={miniThStyle}>Posición</th>
                          <th style={miniThStyle}>Valor de Mercado</th>
                          <th style={miniThStyle}>Equipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jugadores.map((jugador, i) => (
                          <tr key={jugador.id || i} style={miniRowStyle}>
                            <td style={{ ...miniTdStyle, fontWeight: '600', color: '#fff' }}>{jugador.nombre}</td>
                            <td style={miniTdStyle}>
                              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                                {jugador.posicion}
                              </span>
                            </td>
                            <td style={{ ...miniTdStyle, color: 'var(--accent)', fontWeight: '500' }}>
                              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(jugador.valorMercado)}
                            </td>
                            <td style={miniTdStyle}>🛡️ {jugador.nombreEquipo || 'Equipo Desconocido'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Styling definitions (vanilla JS css styles)
const appWrapperStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: 'var(--bg-dark)',
  color: 'var(--text-primary)',
  overflow: 'hidden'
};

const sidebarStyle = {
  width: '260px',
  background: 'rgba(15, 17, 24, 0.85)',
  borderRight: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  flexShrink: 0
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '36px',
  textAlign: 'left'
};

const logoIconStyle = {
  fontSize: '2.2rem',
  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold'
};

const logoTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#fff',
  lineHeight: 1.1
};

const logoSubStyle = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flexGrow: 1
};

const navItemStyle = (isActive) => ({
  background: isActive ? 'var(--primary-glow)' : 'transparent',
  color: isActive ? '#fff' : 'var(--text-secondary)',
  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
  borderRadius: '8px',
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: 'var(--font-family)',
  fontSize: '0.95rem',
  fontWeight: isActive ? '600' : '400',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#fff'
  }
});

const connectionBoxStyle = () => ({
  background: 'rgba(30, 31, 41, 0.4)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  textAlign: 'left'
});

const statusDotStyle = (status) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  display: 'inline-block',
  background: status === 'connected' ? 'var(--accent)' : status === 'checking' ? '#f59e0b' : '#ef4444',
  boxShadow: `0 0 8px ${status === 'connected' ? 'var(--accent)' : status === 'checking' ? '#f59e0b' : '#ef4444'}`
});

const reloadBtnStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  color: '#fff',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '0.75rem',
  cursor: 'pointer',
  fontFamily: 'var(--font-family)',
  transition: 'background 0.2s'
};

const mainContentStyle = {
  flexGrow: 1,
  padding: '40px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100vh',
  textAlign: 'left'
};

const headerBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '40px',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '20px',
  flexWrap: 'wrap',
  gap: '16px'
};

const toastStyle = (type) => ({
  position: 'fixed',
  top: '24px',
  right: '24px',
  background: type === 'error' ? '#7f1d1d' : type === 'info' ? '#1e293b' : '#064e3b',
  border: `1px solid ${type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#10b981'}`,
  color: '#fff',
  borderRadius: '8px',
  padding: '12px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  animation: 'fadeIn 0.3s ease',
  fontSize: '0.9rem'
});

const widgetsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '24px'
};

const widgetCardStyle = (glowColor) => ({
  background: 'rgba(30, 31, 41, 0.5)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: `inset 0 0 12px ${glowColor}`,
  textAlign: 'left'
});

const widgetTitleStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const widgetValueStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#fff',
  marginTop: '8px'
};

const splitLayoutStyle = {
  display: 'flex',
  gap: '30px',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
};

const formLayoutFields = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  textAlign: 'left'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  marginBottom: '6px'
};

const inputFieldStyle = {
  width: '100%',
  background: 'rgba(15, 17, 24, 0.6)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#fff',
  fontFamily: 'var(--font-family)',
  fontSize: '0.9rem',
  outline: 'none'
};

const formBtnStyle = {
  background: 'var(--primary)',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px',
  fontWeight: '600',
  fontFamily: 'var(--font-family)',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'background 0.2s'
};

const emptyContainerStyle = {
  background: 'rgba(30, 31, 41, 0.3)',
  border: '1px dashed var(--border-color)',
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  color: 'var(--text-secondary)'
};

const listContainerStyle = {
  background: 'rgba(30, 31, 41, 0.4)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  overflow: 'hidden'
};

const miniTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeaderStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid var(--border-color)'
};

const miniThStyle = {
  padding: '12px 16px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  textTransform: 'uppercase'
};

const miniRowStyle = {
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const miniTdStyle = {
  padding: '12px 16px',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)'
};

export default App;
