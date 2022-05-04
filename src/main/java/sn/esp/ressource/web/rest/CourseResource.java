package sn.esp.ressource.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sn.esp.ressource.domain.Course;
import sn.esp.ressource.domain.User;
import sn.esp.ressource.repository.CourseRepository;
import sn.esp.ressource.service.CourseService;
import sn.esp.ressource.service.UserService;
import sn.esp.ressource.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sn.esp.ressource.domain.Course}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CourseResource {

    private final Logger log = LoggerFactory.getLogger(CourseResource.class);

    private static final String ENTITY_NAME = "course";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseRepository courseRepository;

    private final UserService userService;

    private final CourseService courseService;

    public CourseResource(CourseRepository courseRepository, UserService userService, CourseService courseService) {
        this.courseRepository = courseRepository;
        this.userService = userService;
        this.courseService = courseService;
    }

    /**
     * {@code POST  /courses} : Create a new course.
     *
     * @param course the course to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new course, or with status {@code 400 (Bad Request)} if the course has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) throws URISyntaxException {
        log.debug("REST request to save Course : {}", course);
        if (course.getId() != null) {
            throw new BadRequestAlertException("Un nouveau cours ne peut pas avoir  un id", ENTITY_NAME, "idexists");
        }
        if (course.getModule().equals(null)) {
            throw new BadRequestAlertException("Un cours doit obligatoirement avoir un module", ENTITY_NAME, "modulerequired");
        } else {
            course.setCourseName(course.getModule().getModuleName());
            course.setUser(course.getModule().getUser());
        }
        if (course.getPointer() == null) {
            course.setPointer(false);
        }
        if (course.getVolumeHoraire() == null) {
            course.setVolumeHoraire(0);
        }
        courseService.courseDay(course);
        Course result = courseRepository.save(course);
        return ResponseEntity
            .created(new URI("/api/courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /courses/:id} : Updates an existing course.
     *
     * @param id the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Course course
    ) throws URISyntaxException {
        log.debug("REST request to update Course : {}, {}", id, course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (course.getModule().equals(null)) {
            throw new BadRequestAlertException("Un cours doit obligatoirement avoir un module", ENTITY_NAME, "modulerequired");
        } else {
            course.setCourseName(course.getModule().getModuleName());
            course.setUser(course.getModule().getUser());
        }
        if (course.getPointer() == null) {
            course.setPointer(false);
        }
        if (course.getVolumeHoraire() == null) {
            course.setVolumeHoraire(0);
        }
        courseService.courseDay(course);
        Course result = courseRepository.save(course);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /courses/:id} : Partial updates given fields of an existing course, field will ignore if it is null
     *
     * @param id the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 404 (Not Found)} if the course is not found,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/courses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Course> partialUpdateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Course course
    ) throws URISyntaxException {
        log.debug("REST request to partial update Course partially : {}, {}", id, course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Course> result = courseRepository
            .findById(course.getId())
            .map(existingCourse -> {
                if (course.getCourseName() != null) {
                    existingCourse.setCourseName(course.getCourseName());
                }
                if (course.getPointer() != null) {
                    existingCourse.setPointer(course.getPointer());
                }
                if (course.getJour() != null) {
                    existingCourse.setJour(course.getJour());
                }

                if (course.getVolumeHoraire() != null) {
                    existingCourse.setVolumeHoraire(course.getVolumeHoraire());
                } else {
                    course.setVolumeHoraire(0);
                }
                if (course.getSalle() != null) {
                    existingCourse.setSalle(course.getSalle());
                }
                if (course.getHeureDeDebut() != null) {
                    existingCourse.setHeureDeDebut(course.getHeureDeDebut());
                }
                if (course.getHeureDeFin() != null) {
                    existingCourse.setHeureDeFin(course.getHeureDeFin());
                }
                courseService.courseDay(course);
                return existingCourse;
            })
            .map(courseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, course.getId().toString())
        );
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        log.debug("REST request to get all Courses");
        return courseRepository.findAll();
    }

    /**
     * {@code GET  /courses/:id} : get the "id" course.
     *
     * @param id the id of the course to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the course, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        log.debug("REST request to get Course : {}", id);
        Optional<Course> course = courseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(course);
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" course.
     *
     * @param id the id of the course to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        log.debug("REST request to delete Course : {}", id);
        courseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/courses/user")
    public ResponseEntity<List<Course>> getUserCourse() {
        User currentUser = userService.getUserWithAuthorities().get();
        return ResponseEntity.ok().body(courseRepository.findCourseByUser(currentUser));
    }

    @GetMapping("/courses/pointer")
    public ResponseEntity<List<Course>> getUserCoursePointer() {
        User currentUser = userService.getUserWithAuthorities().get();
        return ResponseEntity.ok().body(courseRepository.findCourseByUserAndPointerIsTrue(currentUser));
    }

    @GetMapping("/courses/notpointer")
    public ResponseEntity<List<Course>> getUserCourseUnPointer() {
        User currentUser = userService.getUserWithAuthorities().get();
        return ResponseEntity.ok().body(courseRepository.findCourseByUserAndPointerIsFalse(currentUser));
    }

    //The user cours of the week
    @GetMapping("/courses/week")
    public ResponseEntity<List<Course>> getCourseOfWeek() {
        User currentUser = userService.getUserWithAuthorities().get();
        List<Course> courses = courseRepository.findCourseByUserAndPointerIsFalse(currentUser);
        courses = courseService.coursesOfWeek(courses);
        System.out.println("Cours de la semaine");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        for (Course course : courses) System.out.println(course);
        return ResponseEntity.ok().body(courses);
    }
}
