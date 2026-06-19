// Archivo: src/main/java/com/Gestion/api_clubes/dto/EquipoRequestDTO.java
package com.Gestion.api_clubes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class EquipoRequestDTO {

    @NotBlank(message = "El nombre del equipo es obligatorio")
    private String nombre;

    @NotNull(message = "El presupuesto no puede ser nulo")
    @Positive(message = "El presupuesto debe ser mayor a cero")
    private BigDecimal presupuesto;

    @NotBlank(message = "Debes definir una formación táctica (ej. 4-2-3-1)")
    private String formacionTactica;

    // Solo pedimos el ID de la liga a la que pertenece, no todo el objeto Liga
    @NotNull(message = "El ID de la liga es obligatorio")
    private Long ligaId;
}