package sn.esp.ressource.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "total_hour")
    private LocalDate totalHour;

    @Column(name = "begin_hourse")
    private LocalDate beginHourse;

    @Column(name = "end_hour")
    private LocalDate endHour;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Module module;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return this.courseName;
    }

    public Course courseName(String courseName) {
        this.setCourseName(courseName);
        return this;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getTotalHour() {
        return this.totalHour;
    }

    public Course totalHour(LocalDate totalHour) {
        this.setTotalHour(totalHour);
        return this;
    }

    public void setTotalHour(LocalDate totalHour) {
        this.totalHour = totalHour;
    }

    public LocalDate getBeginHourse() {
        return this.beginHourse;
    }

    public Course beginHourse(LocalDate beginHourse) {
        this.setBeginHourse(beginHourse);
        return this;
    }

    public void setBeginHourse(LocalDate beginHourse) {
        this.beginHourse = beginHourse;
    }

    public LocalDate getEndHour() {
        return this.endHour;
    }

    public Course endHour(LocalDate endHour) {
        this.setEndHour(endHour);
        return this;
    }

    public void setEndHour(LocalDate endHour) {
        this.endHour = endHour;
    }

    public Module getModule() {
        return this.module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Course module(Module module) {
        this.setModule(module);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", courseName='" + getCourseName() + "'" +
            ", totalHour='" + getTotalHour() + "'" +
            ", beginHourse='" + getBeginHourse() + "'" +
            ", endHour='" + getEndHour() + "'" +
            "}";
    }
}
