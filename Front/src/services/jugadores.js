import { api } from './api';

/**
 * Service to handle requests for Jugadores (Players).
 */
export const JugadorService = {
  /**
   * Get all players from the backend.
   */
  getAll: async () => {
    return await api.get('/jugadores');
  },

  /**
   * Register a new player.
   */
  create: async (jugadorData) => {
    return await api.post('/jugadores', jugadorData);
  }
};
