import { Routes, Route } from "react-router-dom";
import Todo from "./pages/TodoPage";
import Sidebars from "./layouts/Sidebars";
import KanbanPage from "./pages/KanbanPage";
import WikipediaPage from "./pages/WikipediaPage";
import WeatherPage from "./pages/WeatherPage";
import TaskManagement from "./pages/TaskManagementPage";

function App() {
  return (
    <div>
      <Sidebars>
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/wiki" element={<WikipediaPage />} />
          <Route path="/task" element={<TaskManagement />} />
        </Routes>
      </Sidebars>
    </div>
  );
}

export default App;
