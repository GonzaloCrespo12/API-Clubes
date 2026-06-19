// Archivo: src/main/java/com/Gestion/api_clubes/controller/JugadorController.java
package com.Gestion.api_clubes.controller;

import com.Gestion.api_clubes.dto.JugadorRequestDTO;
import com.Gestion.api_clubes.dto.JugadorResponseDTO;
import com.Gestion.api_clubes.service.JugadorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jugadores")
public class JugadorController {

    private final JugadorService jugadorService;

    public JugadorController(JugadorService jugadorService) {
        this.jugadorService = jugadorService;
    }

    @PostMapping
    public ResponseEntity<JugadorResponseDTO> registrarJugador(@Valid @RequestBody JugadorRequestDTO requestDTO) {
        JugadorResponseDTO nuevoJugador = jugadorService.registrarJugador(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoJugador);
    }

    @GetMapping
    public ResponseEntity<List<JugadorResponseDTO>> obtenerTodos() {
        List<JugadorResponseDTO> jugadores = jugadorService.obtenerTodos();
        return ResponseEntity.ok(jugadores);
    }
}
