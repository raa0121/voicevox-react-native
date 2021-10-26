import { NotoSansJP_400Regular, useFonts } from '@expo-google-fonts/noto-sans-jp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ConfigurationContext } from './src';
import { HomeScreen, SettingScreen } from './src/screens';
import { Configuration } from './src/services/VoicevoxService';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ NotoSansJP_400Regular });
  const [config, setConfig] = useState<Configuration>({} as Configuration);
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ConfigurationContext.Provider
        value={{ config: config, setConfig: setConfig }}>
        <NavigationContainer>
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
        </NavigationContainer>
      </ConfigurationContext.Provider>
    );
  }
}
