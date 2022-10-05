import express from "express";

//routes
import StudentRoute from "../students/student.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/students",
    route: StudentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
