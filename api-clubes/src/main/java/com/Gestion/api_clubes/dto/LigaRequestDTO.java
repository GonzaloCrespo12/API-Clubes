package com.Gestion.api_clubes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LigaRequestDTO {

    @NotBlank(message = "El nombre de la liga no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El país es obligatorio")
    private String pais;
}