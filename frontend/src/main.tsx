import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SignalRProvider } from "./contexts/SignalRContext";
import "./i18n";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SupervisorPage from "./pages/SupervisorPage.tsx";
import HomePlayerPage from "./pages/HomePlayerPage.tsx";
import WaitingRoomPage from "./pages/WaitingRoomPage.tsx";
import CharacterDiscoveryPage from "./pages/CharacterDiscoveryPage.tsx";
import PlayerGameLayout from "./layouts/PlayerGameLayout.tsx";
import SupervisorGuardedLayout from "./layouts/SupervisorGuardedLayout.tsx";
import GamePage from "./pages/GamePage.tsx";
import StudentPhasePage from "./pages/StudentPhasePage.tsx";
import EventPage from "./pages/EventPage.tsx";

const browserRouter = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <HomePlayerPage /> },
  {
    element: <SupervisorGuardedLayout />,
    children: [{ path: "/supervisor", element: <SupervisorPage /> }],
  },
  { path: "/waitingroom/:roomCode", element: <WaitingRoomPage /> },
  {
    element: <PlayerGameLayout />,
    children: [
      { path: "/character-discovery", element: <CharacterDiscoveryPage /> },
      { path: "/student-phase", element: <StudentPhasePage /> },
      { path: "/game", element: <GamePage /> },
      { path: "/eventCard", element: <EventPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SignalRProvider>
      <RouterProvider router={browserRouter} />
    </SignalRProvider>
  </StrictMode>,
);
