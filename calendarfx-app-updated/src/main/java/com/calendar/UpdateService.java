package com.calendar;
import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class UpdateService {
    private static final String API_ULR = "http://localhost:7000/versionning/active";

    public static String fetchActiveVersion() throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(API_ULR)).GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static void downloadUpdate(String downloadLink, String destination) throws IOException, InterruptedException{
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(downloadLink))
                .GET()
                .build();
        HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());
        try(InputStream in = response.body();
            FileOutputStream out = new FileOutputStream(destination)){
            byte[]buffer = new byte[1024];
            int bytesRead;
            while((bytesRead = in.read(buffer)) != -1){
                out.write(buffer, 0, bytesRead);
            }
        }
    }


    /*public static void unzip(String zipFilePath, String destDir) throws IOException {
        File dir = new File(destDir);
        if(!dir.exists())
            dir.mkdirs();
        FileInputStream fis;
        byte[]buffer = new byte[1024];
        fis = new FileInputStream(zipFilePath);
        ZipInputStream zis = new ZipInputStream(fis);
        ZipEntry ze = zis.getNextEntry();
        while(ze != null){
            String fileName = ze.getName();
            File newFile = new File(destDir + File.separator + fileName);
            System.out.println("Unzipping to "+ newFile.getAbsolutePath());
            //create directories for sub directories in zip
            new File(newFile.getParent()).mkdirs();
            FileOutputStream fos = new FileOutputStream(newFile);
            int len;
            while((len = zis.read()) > 0){
                fos.write(buffer, 0, len);
            }
            fos.close();
            zis.closeEntry();
            ze = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();
        fis.close();
    }

    public static void copyDirectory(Path sourceDir, Path targetDir) throws IOException {
        Files.walk(sourceDir)
            .forEach(source -> {
                try{
                    Path target = targetDir.resolve(sourceDir.relativize(source));
                    if (Files.isDirectory(source)) {
                        if (!Files.exists(target)) {
                            Files.createDirectory(target);
                        }
                        else{
                            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
                        }
                    }
                }
                catch(IOException e){
                    e.printStackTrace();
                }
            });
    }*/



}

