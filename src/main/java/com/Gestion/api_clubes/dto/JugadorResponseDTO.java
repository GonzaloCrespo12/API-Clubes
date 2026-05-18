package com.Gestion.api_clubes.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class JugadorResponseDTO {
    private Long id;
    private String nombre;
    private String posicion;
    private BigDecimal valorMercado;
    private String nombreEquipo; // Mostramos el nombre del club para el cliente
}
