package com.Gestion.api_clubes.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "jugadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String posicion;

    @Column(name = "valor_mercado", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorMercado;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipo_id", foreignKey = @ForeignKey(name = "fk_jugador_equipo"))
    private Equipo equipo;
}