import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import {
  AddEvent,
  Dashboard,
  Events,
  Login,
  PublicEvents,
  Registrations,
  Signup,
} from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="addEvent" element={<AddEvent />} />

        <Route path="registrations" element={<Registrations />} />
      </Route>

      <Route path="/" element={<PublicEvents />} />
    </>
  )
);

export default router;
