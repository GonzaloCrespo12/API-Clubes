package com.Gestion.api_clubes.service;

import com.Gestion.api_clubes.dto.LigaRequestDTO;
import com.Gestion.api_clubes.dto.LigaResponseDTO;
import com.Gestion.api_clubes.exception.ResourceNotFoundException;
import com.Gestion.api_clubes.entity.Liga;
import com.Gestion.api_clubes.mapper.LigaMapper;
import com.Gestion.api_clubes.repository.LigaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LigaService {

    private final LigaRepository ligaRepository;
    private final LigaMapper ligaMapper;

    // Inyección de dependencias por constructor (Buena práctica recomendada en lugar de @Autowired en los campos)
    public LigaService(LigaRepository ligaRepository, LigaMapper ligaMapper) {
        this.ligaRepository = ligaRepository;
        this.ligaMapper = ligaMapper;
    }

    // Método para crear una nueva liga
    public LigaResponseDTO crearLiga(LigaRequestDTO requestDTO) {
        // 1. Transformar DTO a Entidad
        Liga nuevaLiga = ligaMapper.toEntity(requestDTO);
        
        // 2. Guardar en Base de Datos usando el Repositorio
        Liga ligaGuardada = ligaRepository.save(nuevaLiga);
        
        // 3. Transformar Entidad a DTO de respuesta y retornarlo
        return ligaMapper.toResponseDTO(ligaGuardada);
    }

    // Método para listar todas las ligas
    public List<LigaResponseDTO> obtenerTodas() {
        // 1. Buscar todas las entidades en Base de Datos
        List<Liga> ligas = ligaRepository.findAll();
        
        // 2. Transformar la lista de Entidades a lista de DTOs
        return ligas.stream()
                .map(ligaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Método para ACTUALIZAR (PUT) de una liga existente
    public LigaResponseDTO actualizarLiga(Long id, LigaRequestDTO requestDTO) {
        // Buscamos si la liga existe; si no, lanzamos un error 
        Liga ligaExistente = ligaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se puede actualizar. Liga no encontrada con ID: " + id));

        // Modificamos los campos permitidos
        ligaExistente.setNombre(requestDTO.getNombre());
        ligaExistente.setPais(requestDTO.getPais());

        // Guardamos los cambios de la entidad mapeada 
        Liga ligaActualizada = ligaRepository.save(ligaExistente);
        return ligaMapper.toResponseDTO(ligaActualizada);
    }

    // Método para ELIMINAR (DELETE) 
    public void eliminarLiga(Long id) {
        if (!ligaRepository.existsById(id)) { // Verificamos si existe antes de borrar 
            throw new ResourceNotFoundException("No se puede eliminar. Liga no encontrada con ID: " + id);
        }
        ligaRepository.deleteById(id); // Borramos físicamente el registro 
    }
}