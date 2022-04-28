package sn.esp.ressource.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sn.esp.ressource.domain.Course;
import sn.esp.ressource.domain.User;

/**
 * Spring Data SQL repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findCourseByUser(User user);
}
