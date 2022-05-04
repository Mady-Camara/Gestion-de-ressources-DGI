package sn.esp.ressource.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
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

    @Column(name = "pointer")
    private Boolean pointer;

    @Column(name = "jour")
    private LocalDate jour;

    @Column(name = "volume_horaire")
    private Integer volumeHoraire;

    @Column(name = "salle")
    private String salle;

    @NotNull
    @Column(name = "heure_de_debut", nullable = false)
    private String heureDeDebut;

    @NotNull
    @Column(name = "heure_de_fin", nullable = false)
    private String heureDeFin;

    @Column(name = "libelle_jour")
    private String libelleJour;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Module module;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "schedule", "course" }, allowSetters = true)
    private ClassRoom classe;

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

    public Boolean getPointer() {
        return this.pointer;
    }

    public Course pointer(Boolean pointer) {
        this.setPointer(pointer);
        return this;
    }

    public void setPointer(Boolean pointer) {
        this.pointer = pointer;
    }

    public LocalDate getJour() {
        return this.jour;
    }

    public Course jour(LocalDate jour) {
        this.setJour(jour);
        return this;
    }

    public void setJour(LocalDate jour) {
        this.jour = jour;
    }

    public Integer getVolumeHoraire() {
        return this.volumeHoraire;
    }

    public Course volumeHoraire(Integer volumeHoraire) {
        this.setVolumeHoraire(volumeHoraire);
        return this;
    }

    public void setVolumeHoraire(Integer volumeHoraire) {
        this.volumeHoraire = volumeHoraire;
    }

    public String getSalle() {
        return this.salle;
    }

    public Course salle(String salle) {
        this.setSalle(salle);
        return this;
    }

    public void setSalle(String salle) {
        this.salle = salle;
    }

    public String getHeureDeDebut() {
        return this.heureDeDebut;
    }

    public Course heureDeDebut(String heureDeDebut) {
        this.setHeureDeDebut(heureDeDebut);
        return this;
    }

    public void setHeureDeDebut(String heureDeDebut) {
        this.heureDeDebut = heureDeDebut;
    }

    public String getHeureDeFin() {
        return this.heureDeFin;
    }

    public Course heureDeFin(String heureDeFin) {
        this.setHeureDeFin(heureDeFin);
        return this;
    }

    public void setHeureDeFin(String heureDeFin) {
        this.heureDeFin = heureDeFin;
    }

    public String getLibelleJour() {
        return this.libelleJour;
    }

    public Course libelleJour(String libelleJour) {
        this.setLibelleJour(libelleJour);
        return this;
    }

    public void setLibelleJour(String libelleJour) {
        this.libelleJour = libelleJour;
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

    public ClassRoom getClasse() {
        return this.classe;
    }

    public void setClasse(ClassRoom classRoom) {
        this.classe = classRoom;
    }

    public Course classe(ClassRoom classRoom) {
        this.setClasse(classRoom);
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
            ", pointer='" + getPointer() + "'" +
            ", jour='" + getJour() + "'" +
            ", volumeHoraire=" + getVolumeHoraire() +
            ", salle='" + getSalle() + "'" +
            ", heureDeDebut='" + getHeureDeDebut() + "'" +
            ", heureDeFin='" + getHeureDeFin() + "'" +
            ", libelleJour='" + getLibelleJour() + "'" +
            "}";
    }
}
