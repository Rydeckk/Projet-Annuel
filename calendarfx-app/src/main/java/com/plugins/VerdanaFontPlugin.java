package com.plugins;

import javafx.scene.Scene;

public class VerdanaFontPlugin implements FontPlugin{
    public void execute(){
        System.out.println("Verdana Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Verdana";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Verdana;");
    }
}
