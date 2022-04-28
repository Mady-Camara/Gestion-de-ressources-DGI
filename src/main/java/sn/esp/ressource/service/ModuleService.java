package sn.esp.ressource.service;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;
import sn.esp.ressource.domain.Module;
import sn.esp.ressource.repository.ModuleRepository;

@Service
@Transactional
public class ModuleService {

    private ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<Module> getCurrentTeacherModule() {
        return moduleRepository.findByUserIsCurrentUser();
    }
}
