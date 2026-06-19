package com.Gestion.api_clubes.service;

import com.Gestion.api_clubes.dto.EquipoRequestDTO;
import com.Gestion.api_clubes.dto.EquipoResponseDTO;
import com.Gestion.api_clubes.exception.ResourceNotFoundException;
import com.Gestion.api_clubes.entity.Equipo;
import com.Gestion.api_clubes.entity.Liga;
import com.Gestion.api_clubes.mapper.EquipoMapper;
import com.Gestion.api_clubes.repository.EquipoRepository;
import com.Gestion.api_clubes.repository.LigaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;
    private final LigaRepository ligaRepository;
    private final EquipoMapper equipoMapper;

    // Inyectamos los repositorios y el mapper
    public EquipoService(EquipoRepository equipoRepository, LigaRepository ligaRepository, EquipoMapper equipoMapper) {
        this.equipoRepository = equipoRepository;
        this.ligaRepository = ligaRepository;
        this.equipoMapper = equipoMapper;
    }

    public EquipoResponseDTO crearEquipo(EquipoRequestDTO dto) {
        // Buscamos la liga en la BD usando el ID que viene en el DTO 
        // Usamos orElseThrow para lanzar un error si nos envían un ID de liga que no existe
        Liga liga = ligaRepository.findById(dto.getLigaId())
                .orElseThrow(() -> new ResourceNotFoundException("Liga no encontrada con el ID: " + dto.getLigaId()));

        // Convertimos el DTO a Entidad 
        Equipo equipo = equipoMapper.toEntity(dto);

        // Asignamos la liga completa al equipo 
        equipo.setLiga(liga);

        // Guardamos el equipo en la BD
        Equipo equipoGuardado = equipoRepository.save(equipo);

        // Convertimos a DTO de respuesta y retornamos
        return equipoMapper.toResponseDTO(equipoGuardado);
    }

    public List<EquipoResponseDTO> obtenerTodos() {
        return equipoRepository.findAll().stream()
                .map(equipoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}