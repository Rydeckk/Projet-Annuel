package com.calendar;

import com.calendarfx.model.Entry;
import javafx.scene.control.ContextMenu;
import javafx.scene.control.MenuItem;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import java.io.IOException;

public class MyEntryContextMenu extends ContextMenu {

    private final ApiService apiService = new ApiService();

    public MyEntryContextMenu(Entry<?> entry) {
        MenuItem editItem = new MenuItem("Edit");
        editItem.setOnAction(event -> new MyEntryDialog(entry).showAndWait());

        MenuItem deleteItem = new MenuItem("Delete");
        deleteItem.setOnAction(event -> {
            try {
                // Remove entry from the calendar
                entry.removeFromCalendar();

                // Call API to delete entry from the database
                apiService.deleteEntryFromApi(entry);

                // Show success alert
                showAlert("Succès", "L'entrée a été supprimée avec succès.", AlertType.INFORMATION);
            } catch (IOException e) {
                e.printStackTrace();
                // Show error alert
                showAlert("Erreur", "Une erreur est survenue lors de la suppression de l'entrée.", AlertType.ERROR);
            }
        });

        getItems().addAll(editItem, deleteItem);
    }

    private void showAlert(String title, String message, AlertType alertType) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}