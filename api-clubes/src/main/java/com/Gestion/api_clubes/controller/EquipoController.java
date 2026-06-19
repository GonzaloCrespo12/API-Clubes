package com.Gestion.api_clubes.controller;

import com.Gestion.api_clubes.dto.EquipoRequestDTO;
import com.Gestion.api_clubes.dto.EquipoResponseDTO;
import com.Gestion.api_clubes.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    // Endpoint para CREAR un equipo (POST) 
    @PostMapping
    public ResponseEntity<EquipoResponseDTO> crearEquipo(@Valid @RequestBody EquipoRequestDTO requestDTO) {
        EquipoResponseDTO nuevoEquipo = equipoService.crearEquipo(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEquipo); // Retorna 201 Created 
    }

    // Endpoint para OBTENER todos los equipos (GET) 
    @GetMapping
    public ResponseEntity<List<EquipoResponseDTO>> obtenerTodos() {
        List<EquipoResponseDTO> equipos = equipoService.obtenerTodos();
        return ResponseEntity.ok(equipos); // Retorna 200 OK 
    }
}