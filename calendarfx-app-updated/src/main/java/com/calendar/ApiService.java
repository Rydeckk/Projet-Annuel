package com.calendar;

import com.calendarfx.model.Calendar;
import com.calendarfx.model.Entry;
import javafx.scene.control.Alert;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ApiService {
    private String apiUrl = "http://vps-1d054ff8.vps.ovh.net:3000";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Boolean isOnline() throws IOException {
        URL url = new URL(apiUrl + "/ping");
        try{
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.connect();
            return conn.getResponseCode() == 200;
        }
        catch(IOException e){
            return false;
        }
    }

    public void loadEntriesFromApi(Calendar... calendars) throws IOException {
        if (!isOnline()) {
            showAlert("Mode Hors Ligne", "L'application est en mode hors ligne. Les entrées ne peuvent pas être chargées.", Alert.AlertType.WARNING);
            return;
        }
        try {
            String response = getRequest(apiUrl + "/association/mine/planning");
            Object json = new JSONTokener(response).nextValue();
            if (json instanceof JSONObject) {
                JSONObject jsonObject = (JSONObject) json;
                if (jsonObject.has("plannings")) {
                    JSONArray entries = jsonObject.getJSONArray("plannings");
                    for (int i = 0; i < entries.length(); i++) {
                        JSONObject jsonEntry = entries.getJSONObject(i);
                        int id =  jsonEntry.getInt("id");
                        String calendar_name = jsonEntry.getString("calendar_name");
                        String title = jsonEntry.getString("title");
                        String location = jsonEntry.getString("location");
                        LocalDate date = LocalDate.parse(jsonEntry.getString("date"));
                        LocalTime startTime = LocalTime.parse(jsonEntry.getString("startTime"));
                        LocalTime endTime = LocalTime.parse(jsonEntry.getString("endTime"));

                        Entry<String> entry = new Entry<>(title);
                        entry.setInterval(date, startTime, date, endTime);
                        entry.setLocation(location);
                        entry.setId(String.valueOf(id));

                        boolean entryExists = false;

                        for (Calendar calendar : calendars) {
                            if (calendar.getName().equals(calendar_name)) {
                                List<Entry<?>> existingEntries = (List<Entry<?>>) calendar.findEntries(date, date, ZoneId.systemDefault()).get(date);

                                if (existingEntries != null) {
                                    for (Entry<?> existingEntry : existingEntries) {
                                        if (existingEntry.getTitle().equals(title) &&
                                                existingEntry.getStartDate().equals(date) &&
                                                existingEntry.getStartTime().equals(startTime) &&
                                                existingEntry.getEndTime().equals(endTime)) {
                                            entryExists = true;
                                            break;
                                        }
                                    }
                                }

                                if (!entryExists) {
                                    calendar.addEntry(entry);
                                    System.out.println("Nouvelle entrée ajoutée au calendrier " + calendar_name + ": " + entry);
                                } else {
                                    System.out.println("Entrée déjà existante, non ajoutée: " + entry.getTitle());
                                }

                                break;
                            }
                        }
                    }
                } else {
                    showAlert("Erreur", "La réponse JSON ne contient pas le champ 'plannings'.", Alert.AlertType.ERROR);
                }
            } else {
                showAlert("Erreur", "La réponse de l'API n'est pas un objet JSON.", Alert.AlertType.ERROR);
            }
        } catch (IOException e) {
            e.printStackTrace();
            showAlert("Erreur", "Une erreur est survenue lors du chargement des entrées du planning.", Alert.AlertType.ERROR);
        }
    }


    public void saveEntriesToApi(Calendar... calendars) throws IOException {
        System.out.println("Début de la méthode saveEntriesToApi");
        if (!isOnline()) {
            showAlert("Mode Hors Ligne", "L'application est en mode hors ligne. Les entrées ne peuvent pas être enregistrées.", Alert.AlertType.WARNING);
            System.out.println("Application en mode hors ligne");
            return;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Charger les entrées existantes depuis l'API
            String response = getRequest("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/planning");
            Set<CalendarEntry> existingEntries = new HashSet<>();
            Object json = new JSONTokener(response).nextValue();
            if (json instanceof JSONObject) {
                JSONObject jsonObject = (JSONObject) json;
                if (jsonObject.has("plannings")) {
                    JSONArray entries = jsonObject.getJSONArray("plannings");
                    for (int i = 0; i < entries.length(); i++) {
                        JSONObject jsonEntry = entries.getJSONObject(i);
                        CalendarEntry calendarEntry = new CalendarEntry(
                                jsonEntry.getString("title"),
                                jsonEntry.getString("date"),
                                jsonEntry.getString("startTime"),
                                jsonEntry.getString("endTime"),
                                jsonEntry.getString("location"),
                                jsonEntry.getString("calendar_name")
                        );
                        existingEntries.add(calendarEntry);
                    }
                }
            }

            // Parcourir les calendriers et vérifier les entrées
            for (Calendar calendar : calendars) {
                System.out.println("Traitement du calendrier: " + calendar.getName());
                Map<LocalDate, List<Entry<?>>> entriesMap = calendar.findEntries(LocalDate.of(2024, 01, 01), LocalDate.of(2024, 12, 31), ZoneId.of("Europe/Paris"));

                if (entriesMap.isEmpty()) {
                    System.out.println("Aucune entrée trouvée pour le calendrier: " + calendar.getName());
                } else {
                    System.out.println("Nombre de dates avec des entrées: " + entriesMap.size());
                    for (LocalDate date : entriesMap.keySet()) {
                        System.out.println("Date: " + date + ", Nombre d'entrées: " + entriesMap.get(date).size());
                    }
                }

                List<Entry<?>> entries = entriesMap.values()
                        .stream()
                        .flatMap(Collection::stream)
                        .collect(Collectors.toList());

                if (entries.isEmpty()) {
                    System.out.println("Aucune entrée collectée après transformation pour le calendrier: " + calendar.getName());
                } else {
                    System.out.println("Nombre total d'entrées collectées: " + entries.size());
                }

                // Filtrer les nouvelles entrées
                for (Entry<?> entry : entries) {
                    CalendarEntry calendarEntry = new CalendarEntry(
                            entry.getTitle(),
                            entry.getStartDate().toString(),
                            entry.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                            entry.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                            entry.getLocation(),
                            calendar.getName()
                    );

                    if (!existingEntries.contains(calendarEntry)) {
                        String jsonEntry = objectMapper.writeValueAsString(calendarEntry);
                        System.out.println("Enregistrement JSON: " + jsonEntry);

                        // Envoi de la requête POST
                        String postResponse = postRequest("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/planning", jsonEntry);
                        System.out.println("Réponse de l'Api : " + postResponse);
                    } else {
                        System.out.println("L'entrée existe déjà: " + calendarEntry.getTitle());
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            showAlert("Erreur", "Une erreur est survenue lors de l'enregistrement des entrées.", Alert.AlertType.ERROR);
        }
        System.out.println("Fin de la méthode saveEntriesToApi");
    }

    public void updateEntryInApi(Entry<?> entry) throws IOException, InterruptedException {
        CalendarEntry calendarEntry = new CalendarEntry(
                entry.getTitle(),
                entry.getStartDate().toString(),
                entry.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                entry.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                entry.getLocation(),
                entry.getCalendar().getName()
        );

        // Assurez-vous que l'ID de l'entrée est correctement défini
        String entryId = entry.getId();
        if (entryId == null || entryId.isEmpty()) {
            throw new IllegalArgumentException("Entry ID is null or empty");
        }

        String jsonEntry = objectMapper.writeValueAsString(calendarEntry);
        System.out.println("Updating entry: " + jsonEntry);

        // Envoi de la requête PUT pour mettre à jour l'entrée
        String url = "http://vps-1d054ff8.vps.ovh.net:3000/association/mine/planning/" + entryId;
        String response = patchRequest(url, jsonEntry);
        System.out.println("Response from API: " + response);

    }

    public void deleteEntryFromApi(Entry<?> entry) throws IOException {
        String url = "http://vps-1d054ff8.vps.ovh.net:3000/association/mine/planning/" + entry.getId();
        deleteRequest(url);
    }

    private String getRequest(String stringUrl) throws IOException {
        URL url = new URL(stringUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.connect();
        Scanner scanner = new Scanner(url.openStream(), StandardCharsets.UTF_8.toString());
        scanner.useDelimiter("\\Z");
        return scanner.hasNext() ? scanner.next() : "";
    }

    private String postRequest(String urlString, String jsonInputString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        System.out.println("Response Code: " + responseCode);
        StringBuilder response = new StringBuilder();
        if (responseCode >= 200 && responseCode < 300) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }
        } else {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getErrorStream(), "utf-8"))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }
        }

        return response.toString();
    }

    private String patchRequest(String urlString, String jsonInputString) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(urlString))
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString(jsonInputString))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int responseCode = response.statusCode();
        System.out.println("Response Code: " + responseCode);

        if (responseCode >= 200 && responseCode < 300) {
            return response.body();
        } else {
            return response.body(); // Retourner la réponse d'erreur pour l'afficher ou la journaliser
        }
    }



    private void deleteRequest(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("DELETE");

        int responseCode = connection.getResponseCode();
        if (responseCode >= 200 && responseCode < 300) {
            // Successfully deleted
            System.out.println("Entry deleted successfully.");
        } else {
            // Handle error
            System.out.println("Failed to delete entry. Response Code: " + responseCode);
        }
    }





    private void showAlert(String title, String message, Alert.AlertType alertType) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
