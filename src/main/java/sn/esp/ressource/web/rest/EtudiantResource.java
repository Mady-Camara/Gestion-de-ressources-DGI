package sn.esp.ressource.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.esp.ressource.domain.ClassRoom;
import sn.esp.ressource.domain.Etudiant;
import sn.esp.ressource.repository.ClassRoomRepository;
import sn.esp.ressource.repository.EtudiantRepository;
import sn.esp.ressource.service.EtudiantService;
import sn.esp.ressource.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sn.esp.ressource.domain.Etudiant}.
 */
@RestController
@RequestMapping("/api")
public class EtudiantResource {

    private final Logger log = LoggerFactory.getLogger(EtudiantResource.class);

    private static final String ENTITY_NAME = "etudiant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtudiantService etudiantService;

    private final EtudiantRepository etudiantRepository;

    private final ClassRoomRepository classRoomRepository;

    public EtudiantResource(
        EtudiantService etudiantService,
        EtudiantRepository etudiantRepository,
        ClassRoomRepository classRoomRepository
    ) {
        this.etudiantService = etudiantService;
        this.etudiantRepository = etudiantRepository;
        this.classRoomRepository = classRoomRepository;
    }

    /**
     * {@code POST  /etudiants} : Create a new etudiant.
     *
     * @param etudiant the etudiant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etudiant, or with status {@code 400 (Bad Request)} if the etudiant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/etudiants")
    public ResponseEntity<Etudiant> createEtudiant(@RequestBody Etudiant etudiant) throws URISyntaxException {
        log.debug("REST request to save Etudiant : {}", etudiant);
        if (etudiant.getId() != null) {
            throw new BadRequestAlertException("A new etudiant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Etudiant result = etudiantService.save(etudiant);
        return ResponseEntity
            .created(new URI("/api/etudiants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /etudiants/:id} : Updates an existing etudiant.
     *
     * @param id the id of the etudiant to save.
     * @param etudiant the etudiant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etudiant,
     * or with status {@code 400 (Bad Request)} if the etudiant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etudiant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/etudiants/{id}")
    public ResponseEntity<Etudiant> updateEtudiant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etudiant etudiant
    ) throws URISyntaxException {
        log.debug("REST request to update Etudiant : {}, {}", id, etudiant);
        if (etudiant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etudiant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etudiantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Etudiant result = etudiantService.save(etudiant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etudiant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /etudiants/:id} : Partial updates given fields of an existing etudiant, field will ignore if it is null
     *
     * @param id the id of the etudiant to save.
     * @param etudiant the etudiant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etudiant,
     * or with status {@code 400 (Bad Request)} if the etudiant is not valid,
     * or with status {@code 404 (Not Found)} if the etudiant is not found,
     * or with status {@code 500 (Internal Server Error)} if the etudiant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/etudiants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Etudiant> partialUpdateEtudiant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etudiant etudiant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Etudiant partially : {}, {}", id, etudiant);
        if (etudiant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etudiant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etudiantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Etudiant> result = etudiantService.partialUpdate(etudiant);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etudiant.getId().toString())
        );
    }

    /**
     * {@code GET  /etudiants} : get all the etudiants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etudiants in body.
     */
    @GetMapping("/etudiants")
    public List<Etudiant> getAllEtudiants() {
        log.debug("REST request to get all Etudiants");
        return etudiantService.findAll();
    }

    @GetMapping("/etudiants/classe/{id}")
    public ResponseEntity<List<Etudiant>> getClassRoomEtudiants(@PathVariable String id) {
        ClassRoom classe = this.classRoomRepository.findById(Long.parseLong(id)).get();
        return ResponseEntity.ok().body(etudiantRepository.findAllByClassRoom(classe));
    }

    /**
     * {@code GET  /etudiants/:id} : get the "id" etudiant.
     *
     * @param id the id of the etudiant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etudiant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/etudiants/{id}")
    public ResponseEntity<Etudiant> getEtudiant(@PathVariable Long id) {
        log.debug("REST request to get Etudiant : {}", id);
        Optional<Etudiant> etudiant = etudiantService.findOne(id);
        return ResponseUtil.wrapOrNotFound(etudiant);
    }

    /**
     * {@code DELETE  /etudiants/:id} : delete the "id" etudiant.
     *
     * @param id the id of the etudiant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/etudiants/{id}")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        log.debug("REST request to delete Etudiant : {}", id);
        etudiantService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
