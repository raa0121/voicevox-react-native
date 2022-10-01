import { NotoSansJP_400Regular, useFonts } from '@expo-google-fonts/noto-sans-jp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from "native-base";
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ConfigurationContext } from './src';
import { HomeScreen, SettingScreen } from './src/screens';
import { Configuration } from './src/services/VoicevoxService';
import { useEvent } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ NotoSansJP_400Regular });
  const [config, setConfig] = useState<Configuration>({} as Configuration);

  useEffect(() => {
    !fontsLoaded
    ? SplashScreen.preventAutoHideAsync()
    : SplashScreen.hideAsync()
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ConfigurationContext.Provider
        value={{ config: config, setConfig: setConfig }}>
        <NavigationContainer>
          <NativeBaseProvider>
            <Tab.Navigator
              initialRouteName='Settings'
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  if (route.name === 'Settings') {
                    return <Ionicons name='settings' size={size} color={color} />;
                  }
                  return <Ionicons name='home' size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name='Home' component={HomeScreen} />
              <Tab.Screen name='Settings' component={SettingScreen} />
            </Tab.Navigator>
          </NativeBaseProvider>
        </NavigationContainer>
      </ConfigurationContext.Provider>
    );
  }
}
