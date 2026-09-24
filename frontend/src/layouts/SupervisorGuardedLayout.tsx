import { useState } from "react";
import { Outlet } from "react-router-dom";
import SupervisorPinGate from "../components/SupervisorPinGate";

export default function SupervisorGuardedLayout() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("supervisorAuthed") === "true",
  );

  function onSuccess() {
    sessionStorage.setItem("supervisorAuthed", "true");
    setAuthed(true);
  }

  if (!authed) {
    return <SupervisorPinGate onSuccess={onSuccess} />;
  }

  return <Outlet />;
}
