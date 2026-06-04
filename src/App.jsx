import { Routes, Route, Navigate } from "react-router-dom";
import Todo from "./pages/TodoPage";
import Sidebars from "./layouts/Sidebars";
import KanbanPage from "./pages/KanbanPage";
import WikipediaPage from "./pages/WikipediaPage";
import WeatherPage from "./pages/WeatherPage";
import TaskManagement from "./pages/TaskManagementPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

/**
 * ProtectedRoute component that redirects unauthenticated users to the login page.
 */

function App() {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Sidebars>
            <Routes>
              <Route path="/" element={<Todo />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/wiki" element={<WikipediaPage />} />
              <Route path="/task" element={<TaskManagement />} />
            </Routes>
          </Sidebars>
        }
      />
    </Routes>
  );
}

export default App;
