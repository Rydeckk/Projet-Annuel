
package com.exemple.controller;

import com.exemple.model.Update;
import com.exemple.services.UpdateServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/versionning")
public class VersionningController {
    private final UpdateServices updateServices;

    @Autowired
    public VersionningController(UpdateServices updateServices) {
        this.updateServices = updateServices;
    }


    @GetMapping("/active")
    public Update getActiveVersion() {
        Update activeVersion = updateServices.getActiveVersion();
        activeVersion.setDownloadLink("http://localhost:7000/download/update");
        return activeVersion;
    }

    @GetMapping("/{version}/isActive")
    public Map<String, Boolean> getActiveVersion(@PathVariable("version") String version) {
        return Map.of("active", updateServices.isActive(version));
    }
}
