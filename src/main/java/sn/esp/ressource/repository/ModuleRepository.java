package sn.esp.ressource.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sn.esp.ressource.domain.Module;

/**
 * Spring Data SQL repository for the Module entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    @Query("select module from Module module where module.user.login = ?#{principal.username}")
    List<Module> findByUserIsCurrentUser();
}
