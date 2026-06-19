package com.Gestion.api_clubes.mapper;

import com.Gestion.api_clubes.dto.JugadorRequestDTO;
import com.Gestion.api_clubes.dto.JugadorResponseDTO;
import com.Gestion.api_clubes.entity.Jugador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JugadorMapper {

    @Mapping(source = "equipo.nombre", target = "nombreEquipo")
    JugadorResponseDTO toResponseDTO(Jugador jugador);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "equipo", ignore = true)
    Jugador toEntity(JugadorRequestDTO dto);
}