import { api } from './api';

/**
 * Service to handle requests for Ligas (Leagues).
 */
export const LigaService = {
  /**
   * Get all leagues from the backend.
   */
  getAll: async () => {
    return await api.get('/ligas');
  },

  /**
   * Create a new league.
   */
  create: async (ligaData) => {
    return await api.post('/ligas', ligaData);
  },

  /**
   * Update an existing league.
   */
  update: async (id, ligaData) => {
    return await api.put(`/ligas/${id}`, ligaData);
  },

  /**
   * Delete a league.
   */
  delete: async (id) => {
    return await api.delete(`/ligas/${id}`);
  }
};
