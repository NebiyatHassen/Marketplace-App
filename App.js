import AppNavigation from "./src/navigation";
import profile from "./Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostScreen from "./src/screens/PostScreen";
import { Provider } from "react-redux";
import store from "./store"; // Path to your Redux store
const queryClient = new QueryClient();
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigation />
      </QueryClientProvider>
    </Provider>
  );
}
