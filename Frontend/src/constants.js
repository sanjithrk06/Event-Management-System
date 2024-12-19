import { AppstoreOutlined, HomeOutlined } from "@ant-design/icons";

export const adminNav = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "event",
    label: "Events",
    children: [
      {
        key: "events",
        label: "Events",
        path: "/dashboard/events",
      },
    ],
  },
  {
    key: "registration",
    label: "Event Registration",
    children: [
      {
        key: "registrations",
        label: "Event Registration",
        path: "/dashboard/registrations",
      },
    ],
  },
];
