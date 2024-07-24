package com.plugins;

import javafx.scene.Scene;

public class ArialFontPlugin implements FontPlugin{

    public void execute(){
        System.out.println("Arial Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Arial";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Arial;");
    }


}
