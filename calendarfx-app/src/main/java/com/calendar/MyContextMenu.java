package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.Entry;
import com.calendarfx.view.DateControl;
import javafx.scene.control.ContextMenu;
import javafx.scene.control.MenuItem;

import java.time.LocalDate;

public class MyContextMenu extends ContextMenu {

    public MyContextMenu(DateControl dateControl, LocalDate date, Calendar calendar) {
        MenuItem newEntryItem = new MenuItem("New Entry");
        newEntryItem.setOnAction(event -> {
            Entry<?> newEntry = new MyEntryFactory().createEntry(date.atStartOfDay(dateControl.getZoneId()), calendar);
            new MyEntryDialog(newEntry).showAndWait();
        });

        getItems().add(newEntryItem);
    }
}
