import { api } from './api';

/**
 * Service to handle requests for Equipos (Teams).
 */
export const EquipoService = {
  /**
   * Get all teams from the backend.
   */
  getAll: async () => {
    return await api.get('/equipos');
  },

  /**
   * Get a team by ID.
   */
  getById: async (id) => {
    return await api.get(`/equipos/${id}`);
  },

  /**
   * Create a new team.
   */
  create: async (equipoData) => {
    return await api.post('/equipos', equipoData);
  },

  /**
   * Update an existing team.
   */
  update: async (id, equipoData) => {
    return await api.put(`/equipos/${id}`, equipoData);
  },

  /**
   * Delete a team.
   */
  delete: async (id) => {
    return await api.delete(`/equipos/${id}`);
  }
};
