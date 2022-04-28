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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sn.esp.ressource.domain.ClassRoom;
import sn.esp.ressource.repository.ClassRoomRepository;
import sn.esp.ressource.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sn.esp.ressource.domain.ClassRoom}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClassRoomResource {

    private final Logger log = LoggerFactory.getLogger(ClassRoomResource.class);

    private static final String ENTITY_NAME = "classRoom";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClassRoomRepository classRoomRepository;

    public ClassRoomResource(ClassRoomRepository classRoomRepository) {
        this.classRoomRepository = classRoomRepository;
    }

    /**
     * {@code POST  /class-rooms} : Create a new classRoom.
     *
     * @param classRoom the classRoom to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classRoom, or with status {@code 400 (Bad Request)} if the classRoom has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/class-rooms")
    public ResponseEntity<ClassRoom> createClassRoom(@RequestBody ClassRoom classRoom) throws URISyntaxException {
        log.debug("REST request to save ClassRoom : {}", classRoom);
        if (classRoom.getId() != null) {
            throw new BadRequestAlertException("A new classRoom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClassRoom result = classRoomRepository.save(classRoom);
        return ResponseEntity
            .created(new URI("/api/class-rooms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /class-rooms/:id} : Updates an existing classRoom.
     *
     * @param id the id of the classRoom to save.
     * @param classRoom the classRoom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classRoom,
     * or with status {@code 400 (Bad Request)} if the classRoom is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classRoom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/class-rooms/{id}")
    public ResponseEntity<ClassRoom> updateClassRoom(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClassRoom classRoom
    ) throws URISyntaxException {
        log.debug("REST request to update ClassRoom : {}, {}", id, classRoom);
        if (classRoom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classRoom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classRoomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClassRoom result = classRoomRepository.save(classRoom);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, classRoom.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /class-rooms/:id} : Partial updates given fields of an existing classRoom, field will ignore if it is null
     *
     * @param id the id of the classRoom to save.
     * @param classRoom the classRoom to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classRoom,
     * or with status {@code 400 (Bad Request)} if the classRoom is not valid,
     * or with status {@code 404 (Not Found)} if the classRoom is not found,
     * or with status {@code 500 (Internal Server Error)} if the classRoom couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/class-rooms/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClassRoom> partialUpdateClassRoom(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClassRoom classRoom
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClassRoom partially : {}, {}", id, classRoom);
        if (classRoom.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classRoom.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classRoomRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClassRoom> result = classRoomRepository
            .findById(classRoom.getId())
            .map(existingClassRoom -> {
                if (classRoom.getClassroomName() != null) {
                    existingClassRoom.setClassroomName(classRoom.getClassroomName());
                }

                return existingClassRoom;
            })
            .map(classRoomRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, classRoom.getId().toString())
        );
    }

    /**
     * {@code GET  /class-rooms} : get all the classRooms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classRooms in body.
     */
    @GetMapping("/class-rooms")
    public List<ClassRoom> getAllClassRooms() {
        log.debug("REST request to get all ClassRooms");
        return classRoomRepository.findAll();
    }

    /**
     * {@code GET  /class-rooms/:id} : get the "id" classRoom.
     *
     * @param id the id of the classRoom to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classRoom, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/class-rooms/{id}")
    public ResponseEntity<ClassRoom> getClassRoom(@PathVariable Long id) {
        log.debug("REST request to get ClassRoom : {}", id);
        Optional<ClassRoom> classRoom = classRoomRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classRoom);
    }

    /**
     * {@code DELETE  /class-rooms/:id} : delete the "id" classRoom.
     *
     * @param id the id of the classRoom to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/class-rooms/{id}")
    public ResponseEntity<Void> deleteClassRoom(@PathVariable Long id) {
        log.debug("REST request to delete ClassRoom : {}", id);
        classRoomRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
