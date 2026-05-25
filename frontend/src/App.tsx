import AppRouter from "./router";
import { AuthProvider } from "./hooks/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
