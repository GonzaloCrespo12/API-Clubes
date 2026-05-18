package com.Gestion.api_clubes.repository;

import com.Gestion.api_clubes.entity.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JugadorRepository extends JpaRepository<Jugador, Long> {
    // Más adelante, si necesitamos buscar jugadores por posición, Spring Data lo hará automático aquí.
}