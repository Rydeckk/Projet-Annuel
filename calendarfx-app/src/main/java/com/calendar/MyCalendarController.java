package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.Entry;
import com.calendarfx.view.CalendarView;
import javafx.scene.control.ContextMenu;
import javafx.scene.control.MenuItem;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;

public class MyCalendarController {

    private final CalendarView calendarView;
    private final Calendar tasksCalendar;
    private final Calendar activitiesCalendar;

    public MyCalendarController(CalendarView calendarView, Calendar tasksCalendar, Calendar activitiesCalendar) {
        this.calendarView = calendarView;
        this.tasksCalendar = tasksCalendar;
        this.activitiesCalendar = activitiesCalendar;
    }

    public void addEntry(String title, LocalDate date, LocalTime startTime, LocalTime endTime) {
        Entry<String> entry = new Entry<>(title);
        entry.setInterval(date, startTime, date, endTime);

        if (title.toLowerCase().contains("task")) {
            tasksCalendar.addEntry(entry);
        } else {
            activitiesCalendar.addEntry(entry);
        }
    }

    public void showContextMenu(LocalDate date) {
        ContextMenu contextMenu = new ContextMenu();
        MenuItem newEntryItem = new MenuItem("New Entry");
        newEntryItem.setOnAction(event -> {
            //Création d'une nouvelle entrée
            Entry<?> newEntry = new MyEntryFactory().createEntry(ZonedDateTime.of(date, LocalTime.now(), calendarView.getZoneId()), tasksCalendar);
            new MyEntryDialog(newEntry).showAndWait();
        });
        contextMenu.getItems().add(newEntryItem);

        // Afficher le menu contextuel à la position du curseur de la souris
        contextMenu.show(calendarView, javafx.stage.Window.getWindows().get(0).getX(), javafx.stage.Window.getWindows().get(0).getY());
    }

    private void fetchUpdateData() {

    }
}
