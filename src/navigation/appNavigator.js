import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// Screens
import ResolveSettingsScreen from "../screens/ResolveSettingsScreen";
import SetupScreen from "../screens/SetupScreen";
import MainScreen from "../screens/MainScreen";

const appNavigator = createSwitchNavigator({
    //ResolveSettings: ResolveSettingsScreen,
    //Setup: SetupScreen,
    Main: MainScreen,
});

const AppNavigator = createAppContainer(appNavigator);

export default AppNavigator;