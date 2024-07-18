#!/bin/bash
JAVAFX_SDK_LIB=/home/soums/openjfx-22.0.1_linux-x64_bin-sdk/javafx-sdk-22.0.1/lib
mvn clean install && \
mkdir -p dist && \
cp target/calendarfx-app-1.0-SNAPSHOT-jar-with-dependencies.jar dist/association-calendar.jar && \
java --module-path $JAVAFX_SDK_LIB -jar --add-modules javafx.controls,javafx.fxml dist/association-calendar.jar

