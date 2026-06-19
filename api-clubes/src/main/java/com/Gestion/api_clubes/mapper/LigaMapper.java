package com.Gestion.api_clubes.mapper;

import com.Gestion.api_clubes.dto.LigaRequestDTO;
import com.Gestion.api_clubes.dto.LigaResponseDTO;
import com.Gestion.api_clubes.entity.Liga;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LigaMapper {

    LigaResponseDTO toResponseDTO(Liga liga);

    // Le decimos a MapStruct que ignore estos campos al crear la Entidad
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "equipos", ignore = true)
    Liga toEntity(LigaRequestDTO dto);
}