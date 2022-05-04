package sn.esp.ressource.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sn.esp.ressource.domain.Course;
import sn.esp.ressource.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    CourseRepository courseRepository;

    public List<LocalDate> daysOfweek() {
        List<LocalDate> semaine = new ArrayList<>();
        Locale local = Locale.getDefault();
        Calendar cal = Calendar.getInstance(local);
        int first = cal.getFirstDayOfWeek();

        for (int jour = first; jour <= first + 5; jour++) {
            semaine.add(LocalDate.of(cal.getWeekYear(), LocalDate.now().getMonthValue(), jour));
        }

        System.out.println("Jours de la semaine");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        System.out.println("==============================================");
        for (LocalDate jour : semaine) System.out.println(jour);

        return semaine;
    }

    public List<Course> coursesOfWeek(List<Course> courses) {
        List<LocalDate> semaine = daysOfweek();
        List<Course> mes = new ArrayList<>();
        for (int i = 0; i < courses.size(); i++) {
            if (semaine.contains(courses.get(i).getJour())) {
                mes.add(courses.get(i));
            }
        }
        return mes;
    }

    public void courseDay(Course course) {
        List<LocalDate> semaine = daysOfweek();
        if (course.getJour().equals(semaine.get(0))) {
            course.setLibelleJour("lundi");
        } else if (course.getJour().equals(semaine.get(1))) {
            course.setLibelleJour("mardi");
        } else if (course.getJour().equals(semaine.get(2))) {
            course.setLibelleJour("mercredi");
        } else if (course.getJour().equals(semaine.get(3))) {
            course.setLibelleJour("jeudi");
        } else if (course.getJour().equals(semaine.get(4))) {
            course.setLibelleJour("vendredi");
        } else if (course.getJour().equals(semaine.get(5))) {
            course.setLibelleJour("samedi");
        }
    }
}
