package com.Gestion.api_clubes.repository; // Ajusta el nombre de tu paquete base

import com.Gestion.api_clubes.entity.Liga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigaRepository extends JpaRepository<Liga, Long> {
}