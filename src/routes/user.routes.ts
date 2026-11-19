
import { Router } from "express";

import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController
} from "../controllers/user.controller";

const router = Router();

// CREATE
router.post("/", createUserController);

// READ ALL
router.get("/", getAllUsersController);

// READ ONE
router.get("/:id", getUserByIdController);

// UPDATE
router.put("/:id", updateUserController);

// DELETE
router.delete("/:id", deleteUserController);

export default router;
