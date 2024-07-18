package com.calendar;

import com.calendarfx.model.Entry;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class MyPopOverContentNode extends VBox {

    public MyPopOverContentNode(Entry<?> entry) {
        Label titleLabel = new Label("Title: " + entry.getTitle());
        Label locationLabel = new Label("Location: " + entry.getLocation());
        Label startLabel = new Label("Start: " + entry.getStartAsLocalDateTime());
        Label endLabel = new Label("End: " + entry.getEndAsLocalDateTime());

        getChildren().addAll(titleLabel, locationLabel, startLabel, endLabel);
    }
}
