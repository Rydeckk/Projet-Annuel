package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.CalendarSource;
import com.calendarfx.model.Entry;
import com.calendarfx.view.CalendarView;
import com.calendarfx.view.DateControl;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import org.json.JSONObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

public class AssociationCalendarApp extends Application {

    private Calendar tasksCalendar;
    private Calendar activitiesCalendar;
    private Calendar Event3;
    private Calendar Event4;
    private Calendar Event5;
    private Calendar Event6;

    @Override
    public void start(Stage primaryStage) {


        CalendarView calendarView = new CalendarView();


        tasksCalendar = new Calendar("Tasks");
        activitiesCalendar = new Calendar("Activities");
        Event3 = new Calendar("Event3");
        Event4 = new Calendar("Event4");
        Event5 = new Calendar("Event5");
        Event6 = new Calendar("Event6");

        tasksCalendar.setStyle(Calendar.Style.STYLE1);
        activitiesCalendar.setStyle(Calendar.Style.STYLE2);
        Event3.setStyle(Calendar.Style.STYLE3);
        Event4.setStyle(Calendar.Style.STYLE4);
        Event5.setStyle(Calendar.Style.STYLE5);
        Event6.setStyle(Calendar.Style.STYLE6);

        CalendarSource myCalendarSource = new CalendarSource("Association Calendars");
        myCalendarSource.getCalendars().addAll(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);


        calendarView.getCalendarSources().addAll(myCalendarSource);


        calendarView.setRequestedTime(LocalTime.now());


        Thread updateTimeThread = new Thread("Calendar: Update Time Thread") {
            @Override
            public void run() {
                while (true) {
                    Platform.runLater(() -> {
                        calendarView.setToday(LocalDate.now());
                        calendarView.setTime(LocalTime.now());
                    });

                    try {

                        sleep(10000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };

        updateTimeThread.setPriority(Thread.MIN_PRIORITY);
        updateTimeThread.setDaemon(true);
        updateTimeThread.start();


        TextField titleField = new TextField();
        titleField.setPromptText("Title");
        titleField.setPrefWidth(100);

        TextField locationField = new TextField();
        titleField.setPromptText("Location");
        titleField.setPrefWidth(100);

        TextField dateField = new TextField();
        dateField.setPromptText("Date (YYYY-MM-DD)");
        dateField.setPrefWidth(100);

        TextField startTimeField = new TextField();
        startTimeField.setPromptText("(HH:MM)");
        startTimeField.setPrefWidth(100);

        TextField endTimeField = new TextField();
        endTimeField.setPromptText("(HH:MM)");
        endTimeField.setPrefWidth(100);

        Button addButton = new Button("Add Entry");
        addButton.setOnAction(e -> {
            String title = titleField.getText();
            String location = locationField.getText();
            LocalDate date = LocalDate.parse(dateField.getText());
            LocalTime startTime = LocalTime.parse(startTimeField.getText());
            LocalTime endTime = LocalTime.parse(endTimeField.getText());

            Entry<String> entry = new Entry<>(title);
            entry.setInterval(date, startTime, date, endTime);
            entry.setLocation(location);
            if (title.toLowerCase().contains("task")) {
                tasksCalendar.addEntry(entry);
            } else {
                activitiesCalendar.addEntry(entry);
            }
        });
        //classloader()
        Button fetchDataButton = new Button("Update");
        fetchDataButton.setOnAction(e -> {
            try{
                String jsonResponse = UpdateService.fetchActiveVersion();
                JSONObject json = new JSONObject(jsonResponse);
                System.out.println("Active version: " + jsonResponse);
                String downloadLink = json.getString("downloadLink");
                String destination = "/home/soums/Documents/MesCours/calendarfx-app/dist/association-calendar-updated.jar";
                UpdateService.downloadUpdate(downloadLink, destination);
                Path source = Paths.get(destination);
                Path target = Paths.get("/home/soums/Documents/MesCours/calendarfx-app/dist/association-calendar.jar");
                Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
                // Redémarrage de l'application
                ProcessBuilder processBuilder = new ProcessBuilder();
                processBuilder.command("./run-update.sh");
                processBuilder.start();
                Platform.exit();
            }
            catch(IOException | InterruptedException ex){
                ex.printStackTrace();
            }
        });

        HBox buttonsBox = new HBox(fetchDataButton);
        buttonsBox.setStyle("-fx-padding: 10;");

        HBox form = new HBox(10, new Label("Title:"), titleField,
                new Label("Location:"), locationField,
                new Label("Date:"), dateField,
                new Label("Start Time:"), startTimeField,
                new Label("End Time:"), endTimeField, addButton);
        form.setStyle("-fx-padding: 10; -fx-alignment: center;");

        VBox.setVgrow(calendarView, Priority.ALWAYS);

        VBox root = new VBox(10, calendarView, form, buttonsBox);
        root.setStyle("-fx-padding: 10;");

        // Ajouter la fonctionnalité de clic droit pour le menu contextuel
        calendarView.setEntryContextMenuCallback(param -> new MyEntryContextMenu(param.getEntry()));

        // Ajouter la fonctionnalité de clic sur une date pour ajouter une nouvelle entrée
        calendarView.addEventHandler(MouseEvent.MOUSE_CLICKED, event -> {
            if (event.getButton() == MouseButton.SECONDARY) {
                DateControl dateControl = (DateControl) event.getSource();
                LocalDate date = calendarView.getToday();
                LocalTime time = calendarView.getTime();
                MyContextMenu contextMenu = new MyContextMenu(dateControl, date, tasksCalendar);
                contextMenu.show(dateControl, event.getScreenX(), event.getScreenY());
                event.consume();
            }
        });

        Scene scene = new Scene(root);
        primaryStage.setTitle("Association Calendar");
        primaryStage.setScene(scene);
        primaryStage.setWidth(1300);
        primaryStage.setHeight(1000);
        primaryStage.centerOnScreen();
        primaryStage.show();
    }

    public static void main(String[] args) {
        Application.launch(args);
    }
}

