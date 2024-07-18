
package com.exemple.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "versionning")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Update {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "numero_version")
    private String numeroVersion;

    @Column(name = "active")
    private boolean active;

    @Column(name = "download_link")
    private String downloadLink;


}
