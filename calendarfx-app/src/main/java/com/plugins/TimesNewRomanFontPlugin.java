package com.plugins;

import javafx.scene.Scene;

public class TimesNewRomanFontPlugin implements FontPlugin{
    public void execute(){
        System.out.println("Times New Roman Font Plugin exécuté!");
    }

    public String getFontName(){
        return "Times New Roman";
    }

    public void applyFont(Scene scene){
        scene.getRoot().setStyle("-fx-font-family: Times New Roman;");
    }
}
