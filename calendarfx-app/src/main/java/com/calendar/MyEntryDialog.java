package com.calendar;

import com.calendarfx.model.Entry;
import javafx.scene.control.*;
import javafx.scene.layout.GridPane;
import javafx.util.Callback;

import java.io.IOException;
import java.time.LocalTime;

public class MyEntryDialog extends Dialog<Void> {

    public MyEntryDialog(Entry<?> entry) {
        setTitle("Edit Entry");
        ApiService apiService = new ApiService();
        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);

        TextField titleField = new TextField(entry.getTitle());
        TextField locationField = new TextField(entry.getLocation());
        DatePicker startDatePicker = new DatePicker(entry.getStartDate());
        DatePicker endDatePicker = new DatePicker(entry.getEndDate());
        TextField startTimeField = new TextField(entry.getStartTime().toString());
        TextField endTimeField = new TextField(entry.getEndTime().toString());

        grid.add(new Label("Title:"), 0, 0);
        grid.add(titleField, 1, 0);
        grid.add(new Label("Location:"), 0, 1);
        grid.add(locationField, 1, 1);
        grid.add(new Label("Start Date:"), 0, 2);
        grid.add(startDatePicker, 1, 2);
        grid.add(new Label("End Date:"), 0, 3);
        grid.add(endDatePicker, 1, 3);
        grid.add(new Label("Start Time:"), 0, 4);
        grid.add(startTimeField, 1, 4);
        grid.add(new Label("End Time:"), 0, 5);
        grid.add(endTimeField, 1, 5);

        getDialogPane().setContent(grid);

        ButtonType saveButtonType = new ButtonType("Save", ButtonBar.ButtonData.OK_DONE);
        getDialogPane().getButtonTypes().addAll(saveButtonType, ButtonType.CANCEL);
        setResultConverter(new Callback<ButtonType, Void>() {
            @Override
            public Void call(ButtonType buttonType) {
                if (buttonType == saveButtonType) {
                    entry.setTitle(titleField.getText());
                    entry.setLocation(locationField.getText());
                    entry.changeStartDate(startDatePicker.getValue());
                    entry.changeEndDate(endDatePicker.getValue());
                    entry.changeStartTime(LocalTime.parse(startTimeField.getText()));
                    entry.changeEndTime(LocalTime.parse(endTimeField.getText()));

                    try {
                        apiService.updateEntryInApi(entry);
                    } catch (IOException | InterruptedException e) {
                        e.printStackTrace();
                        showAlert("Erreur", "Une erreur est survenue lors de la mise à jour de l'entrée.", Alert.AlertType.ERROR);
                    }
                }
                return null;
            }
        });
    }
    private void showAlert(String title, String message, Alert.AlertType alertType) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
