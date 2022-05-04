package sn.esp.ressource.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.esp.ressource.domain.Etudiant;
import sn.esp.ressource.repository.EtudiantRepository;

/**
 * Service Implementation for managing {@link Etudiant}.
 */
@Service
@Transactional
public class EtudiantService {

    private final Logger log = LoggerFactory.getLogger(EtudiantService.class);

    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    /**
     * Save a etudiant.
     *
     * @param etudiant the entity to save.
     * @return the persisted entity.
     */
    public Etudiant save(Etudiant etudiant) {
        log.debug("Request to save Etudiant : {}", etudiant);
        return etudiantRepository.save(etudiant);
    }

    /**
     * Partially update a etudiant.
     *
     * @param etudiant the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Etudiant> partialUpdate(Etudiant etudiant) {
        log.debug("Request to partially update Etudiant : {}", etudiant);

        return etudiantRepository
            .findById(etudiant.getId())
            .map(existingEtudiant -> {
                if (etudiant.getNumeroEtudiant() != null) {
                    existingEtudiant.setNumeroEtudiant(etudiant.getNumeroEtudiant());
                }
                if (etudiant.getPrenom() != null) {
                    existingEtudiant.setPrenom(etudiant.getPrenom());
                }
                if (etudiant.getNom() != null) {
                    existingEtudiant.setNom(etudiant.getNom());
                }
                if (etudiant.getEmail() != null) {
                    existingEtudiant.setEmail(etudiant.getEmail());
                }
                if (etudiant.getTelephone() != null) {
                    existingEtudiant.setTelephone(etudiant.getTelephone());
                }

                return existingEtudiant;
            })
            .map(etudiantRepository::save);
    }

    /**
     * Get all the etudiants.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Etudiant> findAll() {
        log.debug("Request to get all Etudiants");
        return etudiantRepository.findAll();
    }

    /**
     * Get one etudiant by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Etudiant> findOne(Long id) {
        log.debug("Request to get Etudiant : {}", id);
        return etudiantRepository.findById(id);
    }

    /**
     * Delete the etudiant by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Etudiant : {}", id);
        etudiantRepository.deleteById(id);
    }
}
