package com.exemple.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
public class FileController {

    private static final String FILE_PATH = "/home/soums/Documents/MesCours/calendarfx-app-updated/dist/association-calendar.jar";

    @GetMapping("/download/update")
    public ResponseEntity<Resource> downloadUpdate() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Resource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/java-archive");

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
