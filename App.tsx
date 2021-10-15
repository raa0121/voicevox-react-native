import { NotoSansJP_400Regular, useFonts } from '@expo-google-fonts/noto-sans-jp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import { ConfigurationParametersContext } from './src';
import { HomeScreen, SettingScreen } from './src/screens';
import { ConfigurationParameters } from './src/services/VoicevoxService';

const Tab = createBottomTabNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({ NotoSansJP_400Regular });
  const [config, setConfig] = useState<ConfigurationParameters>({} as ConfigurationParameters);
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ConfigurationParametersContext.Provider
        value={{ config: config, setConfig: setConfig }}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='Settings'
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'home';
                } else if (route.name === 'Settings') {
                  iconName = 'settings';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Settings' component={SettingScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ConfigurationParametersContext.Provider>
    );
  }
}
