import { useState, useEffect, useCallback } from 'react';
import { LigaService } from '../services/ligas';

export default function EquipoForm({ onSubmit, initialData = null, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    presupuesto: '',
    formacionTactica: '4-3-3',
    ligaId: ''
  });
  
  const [ligas, setLigas] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingLigas, setLoadingLigas] = useState(false);
  const [showQuickLiga, setShowQuickLiga] = useState(false);
  const [newLigaName, setNewLigaName] = useState('');
  const [newLigaCountry, setNewLigaCountry] = useState('');
  const [quickLigaError, setQuickLigaError] = useState('');

  const fetchLigas = useCallback(async () => {
    setLoadingLigas(true);
    try {
      const data = await LigaService.getAll();
      setLigas(data);
      // Auto-select the first league if listing is populated and no league selected
      setFormData(prev => {
        if (data.length > 0 && !prev.ligaId) {
          return { ...prev, ligaId: data[0].id.toString() };
        }
        return prev;
      });
    } catch (err) {
      console.error('Error al cargar ligas:', err);
    } finally {
      setLoadingLigas(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (active) {
        fetchLigas();
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [fetchLigas]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (active && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          presupuesto: initialData.presupuesto || '',
          formacionTactica: initialData.formacionTactica || '4-3-3',
          ligaId: initialData.ligaId || ''
        });
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del equipo es obligatorio';
    }
    
    if (!formData.presupuesto) {
      newErrors.presupuesto = 'El presupuesto es obligatorio';
    } else if (parseFloat(formData.presupuesto) <= 0) {
      newErrors.presupuesto = 'El presupuesto debe ser mayor a cero';
    }

    if (!formData.formacionTactica.trim()) {
      newErrors.formacionTactica = 'Debes definir una formación táctica';
    }

    if (!formData.ligaId) {
      newErrors.ligaId = 'Debes seleccionar una liga';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert values to correct types for request
    const payload = {
      nombre: formData.nombre,
      presupuesto: parseFloat(formData.presupuesto),
      formacionTactica: formData.formacionTactica,
      ligaId: parseInt(formData.ligaId)
    };

    onSubmit(payload);
  };

  const handleQuickLigaSubmit = async (e) => {
    e.preventDefault();
    setQuickLigaError('');

    if (!newLigaName.trim() || !newLigaCountry.trim()) {
      setQuickLigaError('Nombre y País son obligatorios');
      return;
    }

    try {
      const createdLiga = await LigaService.create({
        nombre: newLigaName.trim(),
        pais: newLigaCountry.trim()
      });

      // Reload ligas list and select the newly created one
      const updatedLigas = await LigaService.getAll();
      setLigas(updatedLigas);
      setFormData(prev => ({ ...prev, ligaId: createdLiga.id.toString() }));
      
      // Reset quick liga form
      setNewLigaName('');
      setNewLigaCountry('');
      setShowQuickLiga(false);
    } catch (err) {
      setQuickLigaError('Error al crear la liga: ' + err.message);
    }
  };

  const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '4-1-4-1', '5-3-2', '3-4-3'];

  return (
    <div className="card-form-container" style={{ animation: 'fadeIn 0.5s ease' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
        {initialData ? '📝 Editar Equipo' : '➕ Crear Nuevo Equipo'}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Nombre */}
        <div>
          <label style={labelStyle}>Nombre del Equipo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej. Real Madrid, Boca Juniors..."
            style={inputStyle(errors.nombre)}
          />
          {errors.nombre && <span style={errorTextStyle}>{errors.nombre}</span>}
        </div>

        {/* Presupuesto */}
        <div>
          <label style={labelStyle}>Presupuesto ($)</label>
          <input
            type="number"
            name="presupuesto"
            value={formData.presupuesto}
            onChange={handleInputChange}
            placeholder="Ej. 15000000.50"
            step="0.01"
            min="0.01"
            style={inputStyle(errors.presupuesto)}
          />
          {errors.presupuesto && <span style={errorTextStyle}>{errors.presupuesto}</span>}
        </div>

        {/* Formación Táctica */}
        <div>
          <label style={labelStyle}>Formación Táctica</label>
          <select
            name="formacionTactica"
            value={formData.formacionTactica}
            onChange={handleInputChange}
            style={selectStyle}
          >
            {formations.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {errors.formacionTactica && <span style={errorTextStyle}>{errors.formacionTactica}</span>}
        </div>

        {/* Liga */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Liga de Competencia</label>
            <button 
              type="button" 
              onClick={() => setShowQuickLiga(!showQuickLiga)}
              style={textButtonStyle}
            >
              {showQuickLiga ? 'Cancelar' : '⚡ Crear Liga'}
            </button>
          </div>

          {!showQuickLiga ? (
            <>
              <select
                name="ligaId"
                value={formData.ligaId}
                onChange={handleInputChange}
                style={selectStyle}
                disabled={loadingLigas}
              >
                {loadingLigas ? (
                  <option>Cargando ligas...</option>
                ) : ligas.length === 0 ? (
                  <option value="">No hay ligas creadas. Crea una primero.</option>
                ) : (
                  <>
                    <option value="" disabled>Selecciona una liga...</option>
                    {ligas.map(l => (
                      <option key={l.id} value={l.id}>{l.nombre} ({l.pais})</option>
                    ))}
                  </>
                )}
              </select>
              {errors.ligaId && <span style={errorTextStyle}>{errors.ligaId}</span>}
            </>
          ) : (
            <div style={quickLigaBoxStyle}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--primary)' }}>Nueva Liga Rápida</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nombre de la Liga (ej. LaLiga)"
                  value={newLigaName}
                  onChange={(e) => setNewLigaName(e.target.value)}
                  style={smallInputStyle}
                />
                <input
                  type="text"
                  placeholder="País (ej. España)"
                  value={newLigaCountry}
                  onChange={(e) => setNewLigaCountry(e.target.value)}
                  style={smallInputStyle}
                />
                {quickLigaError && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{quickLigaError}</div>}
                <button 
                  type="button" 
                  onClick={handleQuickLigaSubmit} 
                  style={{ ...btnStyle, background: 'var(--primary)', padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Confirmar y Asignar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Acciones del Formulario */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button type="submit" style={{ ...btnStyle, flex: 1, background: 'var(--primary)' }}>
            {initialData ? 'Guardar Cambios' : 'Registrar Equipo'}
          </button>
          <button type="button" onClick={onCancel} style={{ ...btnStyle, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// Styling definitions (Vanilla inline style approach for portability)
const labelStyle = {
  display: 'block',
  fontSize: '0.88rem',
  fontWeight: '500',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  textAlign: 'left'
};

const inputStyle = (hasError) => ({
  width: '100%',
  background: 'rgba(15, 17, 24, 0.6)',
  border: `1px solid ${hasError ? '#ef4444' : 'var(--border-color)'}`,
  borderRadius: '8px',
  padding: '12px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  '&:focus': {
    borderColor: 'var(--primary)'
  }
});

const smallInputStyle = {
  width: '100%',
  background: 'rgba(15, 17, 24, 0.8)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  padding: '8px 10px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: '0.85rem',
  outline: 'none'
};

const selectStyle = {
  width: '100%',
  background: 'rgba(15, 17, 24, 0.6)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '12px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family)',
  fontSize: '0.95rem',
  outline: 'none',
  cursor: 'pointer'
};

const errorTextStyle = {
  color: '#ef4444',
  fontSize: '0.8rem',
  marginTop: '4px',
  display: 'block',
  textAlign: 'left'
};

const textButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--primary-hover)',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  padding: '2px 6px',
  transition: 'color 0.2s'
};

const btnStyle = {
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 20px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const quickLigaBoxStyle = {
  background: 'rgba(99, 102, 241, 0.05)',
  border: '1px dashed rgba(99, 102, 241, 0.3)',
  borderRadius: '8px',
  padding: '14px',
  marginTop: '4px',
  textAlign: 'left'
};
