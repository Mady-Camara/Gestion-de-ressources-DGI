package sn.esp.ressource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.esp.ressource.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
