package com.bookfair.system.repository;

import com.bookfair.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByRole(String role);

    @Query("SELECT g.name FROM User u JOIN u.genres g WHERE u.id = :userId")
    List<String> findGenresByUserId(@Param("userId") Long userId);
}
