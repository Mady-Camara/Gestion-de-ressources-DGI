package sn.esp.ressource.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import sn.esp.ressource.IntegrationTest;
import sn.esp.ressource.domain.ClassRoom;
import sn.esp.ressource.repository.ClassRoomRepository;

/**
 * Integration tests for the {@link ClassRoomResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClassRoomResourceIT {

    private static final String DEFAULT_CLASSROOM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CLASSROOM_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/class-rooms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClassRoomRepository classRoomRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClassRoomMockMvc;

    private ClassRoom classRoom;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassRoom createEntity(EntityManager em) {
        ClassRoom classRoom = new ClassRoom().classroomName(DEFAULT_CLASSROOM_NAME);
        return classRoom;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClassRoom createUpdatedEntity(EntityManager em) {
        ClassRoom classRoom = new ClassRoom().classroomName(UPDATED_CLASSROOM_NAME);
        return classRoom;
    }

    @BeforeEach
    public void initTest() {
        classRoom = createEntity(em);
    }

    @Test
    @Transactional
    void createClassRoom() throws Exception {
        int databaseSizeBeforeCreate = classRoomRepository.findAll().size();
        // Create the ClassRoom
        restClassRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classRoom)))
            .andExpect(status().isCreated());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeCreate + 1);
        ClassRoom testClassRoom = classRoomList.get(classRoomList.size() - 1);
        assertThat(testClassRoom.getClassroomName()).isEqualTo(DEFAULT_CLASSROOM_NAME);
    }

    @Test
    @Transactional
    void createClassRoomWithExistingId() throws Exception {
        // Create the ClassRoom with an existing ID
        classRoom.setId(1L);

        int databaseSizeBeforeCreate = classRoomRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClassRoomMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classRoom)))
            .andExpect(status().isBadRequest());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClassRooms() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        // Get all the classRoomList
        restClassRoomMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classRoom.getId().intValue())))
            .andExpect(jsonPath("$.[*].classroomName").value(hasItem(DEFAULT_CLASSROOM_NAME)));
    }

    @Test
    @Transactional
    void getClassRoom() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        // Get the classRoom
        restClassRoomMockMvc
            .perform(get(ENTITY_API_URL_ID, classRoom.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classRoom.getId().intValue()))
            .andExpect(jsonPath("$.classroomName").value(DEFAULT_CLASSROOM_NAME));
    }

    @Test
    @Transactional
    void getNonExistingClassRoom() throws Exception {
        // Get the classRoom
        restClassRoomMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClassRoom() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();

        // Update the classRoom
        ClassRoom updatedClassRoom = classRoomRepository.findById(classRoom.getId()).get();
        // Disconnect from session so that the updates on updatedClassRoom are not directly saved in db
        em.detach(updatedClassRoom);
        updatedClassRoom.classroomName(UPDATED_CLASSROOM_NAME);

        restClassRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClassRoom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClassRoom))
            )
            .andExpect(status().isOk());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
        ClassRoom testClassRoom = classRoomList.get(classRoomList.size() - 1);
        assertThat(testClassRoom.getClassroomName()).isEqualTo(UPDATED_CLASSROOM_NAME);
    }

    @Test
    @Transactional
    void putNonExistingClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classRoom.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classRoom)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClassRoomWithPatch() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();

        // Update the classRoom using partial update
        ClassRoom partialUpdatedClassRoom = new ClassRoom();
        partialUpdatedClassRoom.setId(classRoom.getId());

        partialUpdatedClassRoom.classroomName(UPDATED_CLASSROOM_NAME);

        restClassRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassRoom))
            )
            .andExpect(status().isOk());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
        ClassRoom testClassRoom = classRoomList.get(classRoomList.size() - 1);
        assertThat(testClassRoom.getClassroomName()).isEqualTo(UPDATED_CLASSROOM_NAME);
    }

    @Test
    @Transactional
    void fullUpdateClassRoomWithPatch() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();

        // Update the classRoom using partial update
        ClassRoom partialUpdatedClassRoom = new ClassRoom();
        partialUpdatedClassRoom.setId(classRoom.getId());

        partialUpdatedClassRoom.classroomName(UPDATED_CLASSROOM_NAME);

        restClassRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassRoom))
            )
            .andExpect(status().isOk());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
        ClassRoom testClassRoom = classRoomList.get(classRoomList.size() - 1);
        assertThat(testClassRoom.getClassroomName()).isEqualTo(UPDATED_CLASSROOM_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classRoom.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classRoom))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClassRoom() throws Exception {
        int databaseSizeBeforeUpdate = classRoomRepository.findAll().size();
        classRoom.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassRoomMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(classRoom))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClassRoom in the database
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClassRoom() throws Exception {
        // Initialize the database
        classRoomRepository.saveAndFlush(classRoom);

        int databaseSizeBeforeDelete = classRoomRepository.findAll().size();

        // Delete the classRoom
        restClassRoomMockMvc
            .perform(delete(ENTITY_API_URL_ID, classRoom.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClassRoom> classRoomList = classRoomRepository.findAll();
        assertThat(classRoomList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
