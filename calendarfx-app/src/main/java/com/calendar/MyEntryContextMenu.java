package com.calendar;

import com.calendarfx.model.Entry;
import javafx.scene.control.ContextMenu;
import javafx.scene.control.MenuItem;

public class MyEntryContextMenu extends ContextMenu {

    public MyEntryContextMenu(Entry<?> entry) {
        MenuItem editItem = new MenuItem("Edit");
        editItem.setOnAction(event -> new MyEntryDialog(entry).showAndWait());

        MenuItem deleteItem = new MenuItem("Delete");
        deleteItem.setOnAction(event -> entry.removeFromCalendar());

        getItems().addAll(editItem, deleteItem);
    }
}
