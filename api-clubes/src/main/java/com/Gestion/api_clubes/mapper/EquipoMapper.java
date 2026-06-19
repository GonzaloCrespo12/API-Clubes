// Archivo: src/main/java/com/Gestion/api_clubes/mapper/EquipoMapper.java
package com.Gestion.api_clubes.mapper;

import com.Gestion.api_clubes.dto.EquipoRequestDTO;
import com.Gestion.api_clubes.dto.EquipoResponseDTO;
import com.Gestion.api_clubes.entity.Equipo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EquipoMapper {

    // Al devolver la respuesta, sacamos el nombre de la liga accediendo a equipo.getLiga().getNombre()
    @Mapping(source = "liga.nombre", target = "nombreLiga")
    EquipoResponseDTO toResponseDTO(Equipo equipo);

    // Al crear la entidad, ignoramos el ID (autogenerado), la liga (la buscaremos en el Service) y los jugadores
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "liga", ignore = true)
    @Mapping(target = "jugadores", ignore = true)
    Equipo toEntity(EquipoRequestDTO dto);
}
