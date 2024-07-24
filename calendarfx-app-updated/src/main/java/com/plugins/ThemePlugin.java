package com.plugins;

import javafx.scene.Scene;

public interface ThemePlugin extends Plugin{
    String getThemeName();
    void applyTheme(Scene scene);
    void removeTheme(Scene scene);
}
