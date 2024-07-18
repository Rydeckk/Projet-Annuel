package com.plugins;

import javafx.scene.Scene;

public class GeorgiaFontPlugin implements FontPlugin {
    public void execute(){
        System.out.println("Georgia Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Georgia";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Georgia;");
    }
}
