package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.CalendarSource;
import com.calendarfx.model.Entry;
import com.calendarfx.view.CalendarView;
import com.calendarfx.view.DateControl;
import com.plugins.FontPlugin;
import com.plugins.ThemePlugin;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class AssociationCalendarApp extends Application {

    private Calendar tasksCalendar;
    private Calendar activitiesCalendar;
    private Calendar Event3;
    private Calendar Event4;
    private Calendar Event5;
    private Calendar Event6;
    private Scene mainScene;
    private ThemePlugin currentThemePlugin;


    private void loadAndApplyPlugins(VBox root){
        PluginLoader pluginLoader = new PluginLoader();
        pluginLoader.loadPlugins("/home/soums/Documents/MesCours/calendarfx-app-updated/src/main/java/com/jarPlugins");
        List<FontPlugin> fontPlugins = pluginLoader.getFontPlugins();
        List<ThemePlugin> themePlugins = pluginLoader.getThemeFonts();

        //ComboBox pour choisir la police
        ComboBox<String> fontComboBox = new ComboBox<>(FXCollections.observableList(
                fontPlugins.stream().map(FontPlugin::getFontName).toList()
        ));
        fontComboBox.setValue("Arial");
        fontComboBox.setOnAction(e -> {
            //Scene scene = primaryStage.getScene();
            String selectedFont = fontComboBox.getValue();
            for(FontPlugin fontPlugin : fontPlugins){
                if(fontPlugin.getFontName().equals(selectedFont)){
                    fontPlugin.applyFont(mainScene);
                    break;
                }
            }});
        //checkBox pour changer de theme
        CheckBox themeCheckBox = new CheckBox("Mode sombre");
        themeCheckBox.setOnAction(e -> {
            if(currentThemePlugin != null)
                currentThemePlugin.removeTheme(mainScene);
            if(themeCheckBox.isSelected()){
                ChoiceDialog<String> dialog = new ChoiceDialog<>(
                        themePlugins.get(0).getThemeName(),
                        themePlugins.stream().map(ThemePlugin::getThemeName).toList());

                dialog.setTitle("Choisir un theme");
                dialog.setHeaderText("Choisissez un thème pour l'application");
                dialog.setContentText("Thème:");

                dialog.showAndWait().ifPresent(selectedTheme -> {
                    for(ThemePlugin themePlugin : themePlugins){
                        if(themePlugin.getThemeName().equals(selectedTheme)){
                            themePlugin.applyTheme(mainScene);
                            currentThemePlugin = themePlugin;
                            break;
                        }
                    }
                });
            }
            else{ currentThemePlugin = null;}
        });
        HBox controlBox = new HBox(10, new Label("Police:"), fontComboBox, themeCheckBox);
        controlBox.setStyle("-fx-padding: 10;");
        root.getChildren().add(controlBox);
    }

    @Override
    public void start(Stage primaryStage) throws IOException {


        CalendarView calendarView = new CalendarView();
        ApiService apiServices = new ApiService();

        tasksCalendar = new Calendar("Tasks");
        activitiesCalendar = new Calendar("Activities");
        Event3 = new Calendar("Event3");
        Event4 = new Calendar("Event4");
        Event5 = new Calendar("Event5");
        Event6 = new Calendar("Event6");

        tasksCalendar.setStyle(Calendar.Style.STYLE1);
        activitiesCalendar.setStyle(Calendar.Style.STYLE2);
        Event3.setStyle(Calendar.Style.STYLE3);
        Event4.setStyle(Calendar.Style.STYLE4);
        Event5.setStyle(Calendar.Style.STYLE5);
        Event6.setStyle(Calendar.Style.STYLE6);

        CalendarSource myCalendarSource = new CalendarSource("Association Calendars");
        myCalendarSource.getCalendars().addAll(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);


        calendarView.getCalendarSources().addAll(myCalendarSource);


        calendarView.setRequestedTime(LocalTime.now());


        Thread updateTimeThread = new Thread("Calendar: Update Time Thread") {
            @Override
            public void run() {
                while (true) {
                    Platform.runLater(() -> {
                        calendarView.setToday(LocalDate.now());
                        calendarView.setTime(LocalTime.now());
                    });

                    try {

                        sleep(10000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };


        updateTimeThread.setPriority(Thread.MIN_PRIORITY);
        updateTimeThread.setDaemon(true);
        updateTimeThread.start();

        if(apiServices.isOnline()){
            apiServices.loadEntriesFromApi(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);
        }
        else{
            showAlert("Mode hors ligne", "Les entrées ne seront pas chargées depuis l'API.", Alert.AlertType.INFORMATION);
        }

        primaryStage.setOnCloseRequest(event -> {
            try {
                if(apiServices.isOnline()){
                    try {
                        apiServices.saveEntriesToApi(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);
                    } catch (IOException e) {
                        e.printStackTrace();
                        showAlert("Erreur", "Erreur lors de l'enregistrement des entrées à la fermeture.", Alert.AlertType.ERROR);
                    }
                }
                else {
                    showAlert("Mode hors ligne", "Les entrées ne seront pas sauvegardées dans l'API.", Alert.AlertType.INFORMATION);
                }
            } catch (IOException e) {
                e.printStackTrace();
                showAlert("Erreur", "Erreur lors de la vérification du mode en ligne à la fermeture.", Alert.AlertType.ERROR);
            }
        });


        TextField titleField = new TextField();
        titleField.setPromptText("Title");
        titleField.setPrefWidth(100);

        TextField locationField = new TextField();
        titleField.setPromptText("Location");
        titleField.setPrefWidth(100);

        TextField dateField = new TextField();
        dateField.setPromptText("Date (YYYY-MM-DD)");
        dateField.setPrefWidth(100);

        TextField startTimeField = new TextField();
        startTimeField.setPromptText("(HH:MM:SS)");
        startTimeField.setPrefWidth(100);

        TextField endTimeField = new TextField();
        endTimeField.setPromptText("(HH:MM:SS)");
        endTimeField.setPrefWidth(100);

        Button addButton = new Button("Add Entry");
        addButton.setOnAction(e -> {
            String title = titleField.getText();
            String location = locationField.getText();
            LocalDate date = LocalDate.parse(dateField.getText());
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
            LocalTime startTime = LocalTime.parse(startTimeField.getText(), timeFormatter);
            LocalTime endTime = LocalTime.parse(endTimeField.getText(), timeFormatter);


            Entry<String> entry = new Entry<>(title);
            entry.setInterval(date, startTime, date, endTime);
            entry.setLocation(location);
            if (title.toLowerCase().contains("task")) {
                tasksCalendar.addEntry(entry);
                System.out.println("Nouvelle entrée ajoutée au calendrier Tasks: " + entry);
            } else {
                activitiesCalendar.addEntry(entry);
                System.out.println("Nouvelle entrée ajoutée au calendrier Activities: " + entry);
            }
            try {
                if (apiServices.isOnline()) {
                    apiServices.saveEntriesToApi(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);
                } else {
                    showAlert("Mode hors ligne", "Les entrées ne seront pas sauvegardées dans l'API.", Alert.AlertType.INFORMATION);
                }
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });

        Button reloadButton = new Button("Recharger les données");
        reloadButton.setOnAction(e -> {
            try {
                if (apiServices.isOnline()) {
                    apiServices.loadEntriesFromApi(tasksCalendar, activitiesCalendar, Event3, Event4, Event5, Event6);
                } else {
                    showAlert("Mode hors ligne", "Impossible de recharger les données.", Alert.AlertType.ERROR);
                }
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });

        CheckBox onlineCheckBox = new CheckBox("Mode en ligne");
        onlineCheckBox.setSelected(apiServices.isOnline());
        onlineCheckBox.setOnAction(e -> {
            try {
                if (onlineCheckBox.isSelected() && !apiServices.isOnline()) {
                    showAlert("Mode hors ligne", "Connexion impossible à l'API. Repasse en mode hors ligne.", Alert.AlertType.ERROR);
                    onlineCheckBox.setSelected(false);
                } else if (onlineCheckBox.isSelected()) {
                    showAlert("Mode en ligne", "Mode en ligne activé.", Alert.AlertType.INFORMATION);
                } else {
                    showAlert("Mode hors ligne", "Mode hors ligne activé.", Alert.AlertType.INFORMATION);
                }
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        });



        //Bouton de mise à jour
        Button fetchDataButton = new Button("Update");
        fetchDataButton.setOnAction(e -> {
            try{
              /*  String jsonResponse = UpdateService.fetchActiveVersion();
                JSONObject json = new JSONObject(jsonResponse);
                System.out.println("Active version: " + jsonResponse);
                String downloadLink = json.getString("downloadLink");
                String destination = "update.jar";
                UpdateService.downloadUpdate(downloadLink, destination);
                Path source = Paths.get(destination);
                Path target = Paths.get("path/to/my/application.jar");
                Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);*/
                // Redémarrage de l'application
                System.out.println(" debut execution ./run.sh");
                // Runtime.getRuntime().exec("./run.sh");
                ProcessBuilder processBuilder = new ProcessBuilder();
                        processBuilder.command("./run-update.sh");
                        processBuilder.start();
                Platform.exit();
                System.out.println("fin execution run.sh");
            }
            catch(Exception ex){
                ex.printStackTrace();
            }
        });
        HBox buttonsBox = new HBox(fetchDataButton);
        //buttonsBox.setStyle("-fx-padding: 10;");

        HBox form = new HBox(10, new Label("Title:"), titleField,
                new Label("Location:"), locationField,
                new Label("Date:"), dateField,
                new Label("Start Time:"), startTimeField,
                new Label("End Time:"), endTimeField, addButton);
        form.setStyle("-fx-padding: 10; -fx-alignment: center;");

        VBox.setVgrow(calendarView, Priority.ALWAYS);


        //HBox themeBox = new HBox(10, themeCheckBox);
        VBox root = new VBox(10, calendarView, form);
        root.setStyle("-fx-padding: 10;");



        Region spacer2 = new Region();
        HBox.setHgrow(spacer2, Priority.ALWAYS);
        Region spacer3 = new Region();
        HBox.setHgrow(spacer3, Priority.ALWAYS);

        //HBox fontBox = new HBox(10, new Label("Police:"), fontComboBox);
        HBox controlBox = new HBox(10,fetchDataButton,reloadButton,onlineCheckBox);
        controlBox.setStyle("-fx-padding: 10;");
        root.getChildren().addAll(controlBox);





        // Ajouter la fonctionnalité de clic droit pour le menu contextuel
        calendarView.setEntryContextMenuCallback(param -> new MyEntryContextMenu(param.getEntry()));

        // Ajouter la fonctionnalité de clic sur une date pour ajouter une nouvelle entrée
        calendarView.addEventHandler(MouseEvent.MOUSE_CLICKED, event -> {
            if (event.getButton() == MouseButton.SECONDARY) {
                DateControl dateControl = (DateControl) event.getSource();
                LocalDate date = calendarView.getToday();
                LocalTime time = calendarView.getTime();
                MyContextMenu contextMenu = new MyContextMenu(dateControl, date, tasksCalendar);
                contextMenu.show(dateControl, event.getScreenX(), event.getScreenY());
                event.consume();
            }
        });

        Scene scene = new Scene(root);
        primaryStage.setTitle("Association Calendar");
        primaryStage.setScene(scene);
        primaryStage.setWidth(1300);
        primaryStage.setHeight(1000);
        primaryStage.centerOnScreen();
        primaryStage.show();
        mainScene = scene;

        // Charger et appliquer les plugins
        loadAndApplyPlugins(root);
    }
    private void showAlert(String title, String message, Alert.AlertType alertType) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    public static void main(String[] args) {
        Application.launch(args);
    }
}

