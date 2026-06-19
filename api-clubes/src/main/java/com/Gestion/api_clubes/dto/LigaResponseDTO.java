package com.Gestion.api_clubes.dto;

import lombok.Data;

@Data
public class LigaResponseDTO {
    private Long id;
    private String nombre;
    private String pais;
    
    // No incluimos la lista de Equipos aquí por ahora para mantener la respuesta limpia y simple.
}