package br.com.fiap.acessly.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.fiap.acessly.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
    Page<User> findByNameContainingIgnoreCaseAndEmailContainingIgnoreCase(
        String name,
        String email,
        Pageable pageable);
    
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
