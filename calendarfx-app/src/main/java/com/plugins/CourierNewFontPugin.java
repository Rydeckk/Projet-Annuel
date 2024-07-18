package com.plugins;

import javafx.scene.Scene;

public class CourierNewFontPugin implements FontPlugin{
    public void execute(){
        System.out.println("Courier New Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Courier New";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Courier New;");
    }
}
