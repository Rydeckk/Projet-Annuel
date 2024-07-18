#!/bin/bash

# Répertoire contenant les fichiers .java
SOURCE_DIR=$(pwd)

# Chemin vers les bibliothèques JavaFX
JAVAFX_SDK_LIB=/home/soums/openjfx-22.0.1_linux-x64_bin-sdk/javafx-sdk-22.0.1/lib

# Répertoire de destination pour les fichiers JAR
DEST_DIR=/home/soums/Documents/MesCours/calendarfx-app-updated/src/main/java/com/jarPlugins

# Crée le répertoire de destination s'il n'existe pas
mkdir -p $DEST_DIR

# Fichier manifeste générique
MANIFEST_FILE=MANIFEST.MF

# Crée un fichier MANIFEST.MF
echo "Manifest-Version: 1.0" > $MANIFEST_FILE

# Compiler tous les fichiers Java
javac --module-path $JAVAFX_SDK_LIB --add-modules javafx.controls,javafx.fxml *.java

# Vérifier si la compilation a réussi
if [ $? -ne 0 ]; then
    echo "La compilation a échoué. Veuillez vérifier les erreurs ci-dessus."
    exit 1
fi

# Créer des JAR pour chaque fichier .class
for java_file in *.java; do
    class_file="${java_file%.java}.class"
    jar_file="${java_file%.java}.jar"
    class_name="${java_file%.java}"

    # Vérifier si le fichier .class existe
    if [ -f "$class_file" ]; then
        # Créer le répertoire META-INF et le fichier plugin.properties
        mkdir -p META-INF
        echo "plugin.class=com.plugins.$class_name" > META-INF/plugin.properties

        # Créer le fichier JAR
        jar cvfm $jar_file $MANIFEST_FILE $class_file META-INF/plugin.properties

        # Copier le fichier JAR vers le répertoire de destination
        cp $jar_file $DEST_DIR

        # Supprimer le fichier .class, .jar et le répertoire META-INF du répertoire courant
        rm $class_file
        rm $jar_file
        rm -r META-INF
    else
        echo "Erreur : $class_file introuvable. Vérifiez que la compilation a réussi pour $java_file."
    fi
done

# Nettoyer le fichier MANIFEST.MF
rm $MANIFEST_FILE

echo "Tous les fichiers JAR ont été créés, copiés vers $DEST_DIR et les fichiers temporaires ont été supprimés."
