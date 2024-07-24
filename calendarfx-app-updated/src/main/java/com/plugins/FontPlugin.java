package com.plugins;

import javafx.scene.Scene;

public interface FontPlugin extends Plugin{
    String getFontName();
    void applyFont(Scene scene);
}

