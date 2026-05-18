package com.Gestion.api_clubes.service;

import com.Gestion.api_clubes.dto.JugadorRequestDTO;
import com.Gestion.api_clubes.dto.JugadorResponseDTO;
import com.Gestion.api_clubes.entity.Equipo;
import com.Gestion.api_clubes.entity.Jugador;
import com.Gestion.api_clubes.mapper.JugadorMapper;
import com.Gestion.api_clubes.repository.EquipoRepository;
import com.Gestion.api_clubes.repository.JugadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JugadorService {

    private final JugadorRepository jugadorRepository;
    private final EquipoRepository equipoRepository;
    private final JugadorMapper jugadorMapper;

    public JugadorService(JugadorRepository jugadorRepository, EquipoRepository equipoRepository, JugadorMapper jugadorMapper) {
        this.jugadorRepository = jugadorRepository;
        this.equipoRepository = equipoRepository;
        this.jugadorMapper = jugadorMapper;
    }

    public JugadorResponseDTO registrarJugador(JugadorRequestDTO dto) {
        // 1. Validamos que el equipo exista [cite: 563-565]
        Equipo equipo = equipoRepository.findById(dto.getEquipoId())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con el ID: " + dto.getEquipoId()));

        // 2. Convertimos DTO a Entidad
        Jugador jugador = jugadorMapper.toEntity(dto);

        // 3. Asignamos el equipo
        jugador.setEquipo(equipo);

        // 4. Guardamos en la Base de Datos
        Jugador jugadorGuardado = jugadorRepository.save(jugador);

        // 5. Devolvemos la respuesta mapeada
        return jugadorMapper.toResponseDTO(jugadorGuardado);
    }

    public List<JugadorResponseDTO> obtenerTodos() {
        return jugadorRepository.findAll().stream()
                .map(jugadorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}