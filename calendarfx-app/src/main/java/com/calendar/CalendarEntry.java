package com.calendar;

import java.util.Objects;

public class CalendarEntry {
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String location;
    private String calendar_name;

    // Constructeurs, getters et setters
    public CalendarEntry(String title, String date, String start_time, String end_time, String location, String calendar_name) {
        this.title = title;
        this.date = date;
        this.startTime = start_time;
        this.endTime = end_time;
        this.location = location;
        this.calendar_name = calendar_name;
    }

    // Getters et setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCalendar_name() {
        return calendar_name;
    }

    public void setCalendar_name(String calendar_name) {
        this.calendar_name = calendar_name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CalendarEntry that = (CalendarEntry) o;
        return Objects.equals(title, that.title) &&
                Objects.equals(date, that.date) &&
                Objects.equals(startTime, that.startTime) &&
                Objects.equals(endTime, that.endTime) &&
                Objects.equals(location, that.location) &&
                Objects.equals(calendar_name, that.calendar_name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, date, startTime, endTime, location, calendar_name);
    }

}
