package sn.esp.ressource.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sn.esp.ressource.domain.ClassRoom;
import sn.esp.ressource.domain.Etudiant;

/**
 * Spring Data SQL repository for the Etudiant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    List<Etudiant> findAllByClassRoom(ClassRoom classRoom);
}
