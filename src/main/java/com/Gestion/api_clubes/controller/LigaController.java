package com.Gestion.api_clubes.controller;

import com.Gestion.api_clubes.dto.LigaRequestDTO;
import com.Gestion.api_clubes.dto.LigaResponseDTO;
import com.Gestion.api_clubes.service.LigaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ligas")
public class LigaController {

    private final LigaService ligaService;

    // Inyectamos el servicio por constructor
    public LigaController(LigaService ligaService) {
        this.ligaService = ligaService;
    }

    // Endpoint para CREAR una liga (POST)
    @PostMapping
    public ResponseEntity<LigaResponseDTO> crearLiga(@Valid @RequestBody LigaRequestDTO requestDTO) {
        LigaResponseDTO nuevaLiga = ligaService.crearLiga(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaLiga);
    }

    // Endpoint para OBTENER todas las ligas (GET)
    @GetMapping
    public ResponseEntity<List<LigaResponseDTO>> obtenerTodas() {
        List<LigaResponseDTO> ligas = ligaService.obtenerTodas();
        return ResponseEntity.ok(ligas);
    }

    // Endpoint para ACTUALIZAR una liga por su ID (PUT) 
    @PutMapping("/{id}")
    public ResponseEntity<LigaResponseDTO> actualizarLiga(@PathVariable Long id, @Valid @RequestBody LigaRequestDTO requestDTO) {
        LigaResponseDTO actualizada = ligaService.actualizarLiga(id, requestDTO);
        return ResponseEntity.ok(actualizada); // Retorna 200 OK con los datos nuevos 
    }

    // Endpoint para ELIMINAR una liga por su ID (DELETE) 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLiga(@PathVariable Long id) {
        ligaService.eliminarLiga(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content (operación exitosa sin cuerpo) 
    }
}