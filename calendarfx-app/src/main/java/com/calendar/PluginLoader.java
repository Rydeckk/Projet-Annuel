package com.calendar;

import com.plugins.FontPlugin;
import com.plugins.Plugin;
import com.plugins.ThemePlugin;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class PluginLoader {
    private List<Plugin> plugins = new ArrayList<>();
    private List<FontPlugin> fontPlugins = new ArrayList<>();
    private List<ThemePlugin> themeFonts = new ArrayList<>();

    public void loadPlugins(String pluginDir){
        File dir = new File(pluginDir);
        if(!dir.exists() || !dir.isDirectory())
            throw new IllegalArgumentException("repertoire des plugins invalide!");
        File[]files = dir.listFiles((d, name) -> name.endsWith(".jar"));
        if (files == null)
            return;
        for(File file : files){
            try
            {
                URL jarUrl = file.toURI().toURL();
                URLClassLoader classLoader = new URLClassLoader(new URL[]{jarUrl}, getClass().getClassLoader());
                for(String className : getPluginClassNames(classLoader)){
                    Class<?> clazz = Class.forName(className, true, classLoader);
                    if(Plugin.class.isAssignableFrom(clazz)){
                        Plugin plugin = (Plugin) clazz.getDeclaredConstructor().newInstance();
                        if(plugin instanceof FontPlugin){
                            fontPlugins.add((FontPlugin) plugin);
                        }
                        else if(plugin instanceof ThemePlugin){
                            themeFonts.add((ThemePlugin) plugin);
                        }
                        plugins.add(plugin);
                    }
                }
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }
        }
    }

    private List<String> getPluginClassNames(ClassLoader classLoader) throws IOException {
        List<String> classNames = new ArrayList<>();
        URL ressource = classLoader.getResource("META-INF/plugin.properties");
        if(ressource != null){
            Properties properties = new Properties();
            properties.load(ressource.openStream());
            String className = properties.getProperty("plugin.class");
            if(className != null)
                classNames.add(className);
        }
        return classNames;
    }

    public List<Plugin> getPlugins() {
        return plugins;
    }

    public List<FontPlugin> getFontPlugins() { return fontPlugins; }

    public List<ThemePlugin> getThemeFonts() { return themeFonts; }
}
