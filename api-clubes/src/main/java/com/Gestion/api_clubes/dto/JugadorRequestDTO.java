package com.Gestion.api_clubes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class JugadorRequestDTO {

    @NotBlank(message = "El nombre del jugador es obligatorio")
    private String nombre;

    @NotBlank(message = "La posición táctica es obligatoria (ej. Delantero, Lateral Derecho)")
    private String posicion;

    @NotNull(message = "El valor de mercado no puede ser nulo")
    @Positive(message = "El valor de mercado debe ser un número positivo")
    private BigDecimal valorMercado;

    @NotNull(message = "El ID del equipo es obligatorio")
    private Long equipoId;
}