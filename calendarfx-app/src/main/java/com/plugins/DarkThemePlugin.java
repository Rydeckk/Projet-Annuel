package com.plugins;

import javafx.scene.Scene;

public class DarkThemePlugin implements ThemePlugin {
    public void execute(){
        System.out.println("Dark Theme Plugin execute");
    }

    public String getThemeName(){
        return "Dark Theme";
    }

    public void applyTheme(Scene scene){
        scene.getStylesheets().add(getClass().getResource("/dark-theme.css").toExternalForm());
    }
    public void removeTheme(Scene scene){
        scene.getStylesheets().remove(getClass().getResource("/dark-theme.css").toExternalForm());
    }

}
