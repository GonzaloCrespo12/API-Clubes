package com.Gestion.api_clubes.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class EquipoResponseDTO {
    private Long id;
    private String nombre;
    private BigDecimal presupuesto;
    private String formacionTactica;
    
    // Devolvemos el nombre de la liga para que sea facil de leer por el cliente
    private String nombreLiga; 
}