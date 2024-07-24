package com.plugins;

import javafx.scene.Scene;

public class TahomaFontPlugin implements FontPlugin{
    public void execute(){
        System.out.println("Tahoma Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Tahoma";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Tahoma;");
    }
}
