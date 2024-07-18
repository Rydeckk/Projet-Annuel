package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.Entry;

import java.time.ZonedDateTime;

public class MyEntryFactory {

    public Entry<?> createEntry(ZonedDateTime time, Calendar calendar) {
        Entry<String> entry = new Entry<>("New Entry");
        entry.setCalendar(calendar);
        entry.changeStartDate(time.toLocalDate());
        entry.changeStartTime(time.toLocalTime());
        entry.changeEndDate(time.toLocalDate());
        entry.changeEndTime(time.toLocalTime().plusHours(1));
        return entry;
    }
}
