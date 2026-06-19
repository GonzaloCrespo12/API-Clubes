import { useState } from 'react';

export default function EquipoList({ equipos, onEdit, onDelete, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Currency Formatter
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Filtered teams
  const filteredEquipos = equipos.filter(eq => {
    const term = searchTerm.toLowerCase();
    return (
      eq.nombre.toLowerCase().includes(term) ||
      eq.formacionTactica.toLowerCase().includes(term) ||
      (eq.nombreLiga && eq.nombreLiga.toLowerCase().includes(term))
    );
  });

  // Calculate Metrics
  const totalPresupuesto = equipos.reduce((sum, eq) => sum + (eq.presupuesto || 0), 0);
  const promedioPresupuesto = equipos.length > 0 ? totalPresupuesto / equipos.length : 0;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Metrics Row */}
      <div style={metricsRowStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>🛡️</div>
          <div>
            <div style={metricLabelStyle}>Total Equipos</div>
            <div style={metricValueStyle}>{equipos.length}</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>💰</div>
          <div>
            <div style={metricLabelStyle}>Presupuesto Total</div>
            <div style={metricValueStyle}>{formatCurrency(totalPresupuesto)}</div>
          </div>
        </div>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>📊</div>
          <div>
            <div style={metricLabelStyle}>Promedio Presupuesto</div>
            <div style={metricValueStyle}>{formatCurrency(promedioPresupuesto)}</div>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div style={controlBarStyle}>
        <div style={searchContainerStyle}>
          <span style={searchIconStyle}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, formación, liga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        
        <button 
          onClick={onAddNew} 
          style={{ ...btnStyle, background: 'var(--primary)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
        >
          ➕ Agregar Equipo
        </button>
      </div>

      {/* List Container */}
      {filteredEquipos.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No se encontraron equipos
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '400px' }}>
            {equipos.length === 0 
              ? 'Aún no hay equipos registrados en el sistema. Registra el primero haciendo clic en el botón.'
              : 'Ningún equipo coincide con los criterios de búsqueda actuales.'}
          </p>
          {equipos.length === 0 && (
            <button onClick={onAddNew} style={{ ...btnStyle, background: 'var(--primary)' }}>
              Registrar Primer Equipo
            </button>
          )}
        </div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Presupuesto</th>
                <th style={thStyle}>Formación Táctica</th>
                <th style={thStyle}>Liga</th>
                <th style={{ ...thStyle, textAlignment: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipos.map((eq, i) => (
                <tr key={eq.id || i} style={tableRowStyle}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{eq.nombre}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--accent)', fontWeight: '500' }}>
                    {formatCurrency(eq.presupuesto)}
                  </td>
                  <td style={tdStyle}>
                    <span style={tacticalBadgeStyle}>{eq.formacionTactica}</span>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                    🌍 {eq.nombreLiga || 'Liga Desconocida'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => onEdit(eq)} 
                        style={actionButtonStyle('var(--primary-hover)')}
                        title="Editar Equipo"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => onDelete(eq.id, eq.nombre)} 
                        style={actionButtonStyle('#ef4444')}
                        title="Eliminar Equipo"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styling
const metricsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px',
  marginBottom: '32px'
};

const metricCardStyle = {
  background: 'rgba(30, 31, 41, 0.4)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  textAlign: 'left'
};

const metricIconStyle = {
  fontSize: '2rem',
  background: 'rgba(255, 255, 255, 0.03)',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const metricLabelStyle = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const metricValueStyle = {
  fontSize: '1.3rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  marginTop: '4px'
};

const controlBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
  flexWrap: 'wrap'
};

const searchContainerStyle = {
  position: 'relative',
  flex: '1 1 300px',
  maxWidth: '450px'
};

const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--text-muted)',
  fontSize: '0.9rem'
};

const searchInputStyle = {
  width: '100%',
  background: 'rgba(15, 17, 24, 0.6)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '10px 10px 10px 38px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const btnStyle = {
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px'
};

const emptyStateStyle = {
  background: 'rgba(30, 31, 41, 0.4)',
  border: '1px dashed var(--border-color)',
  borderRadius: '16px',
  padding: '60px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const tableWrapperStyle = {
  background: 'rgba(30, 31, 41, 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid var(--border-color)',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeaderRowStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid var(--border-color)'
};

const thStyle = {
  padding: '16px 20px',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableRowStyle = {
  borderBottom: '1px solid var(--border-color)',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.01)'
  }
};

const tdStyle = {
  padding: '16px 20px',
  fontSize: '0.95rem',
  verticalAlign: 'middle'
};

const tacticalBadgeStyle = {
  background: 'var(--primary-glow)',
  color: 'var(--primary)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const actionButtonStyle = (hoverColor) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  width: '32px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  '&:hover': {
    background: hoverColor,
    borderColor: hoverColor,
    transform: 'translateY(-1px)'
  }
});
