const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// SUPABASE
// ========================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
    res.send("Task Tracker API is running");
});


// ========================================
// GET ALL TASKS
// ========================================

app.get("/api/tasks", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Supabase GET error:",
                error
            );

            return res.status(500).json({
                message: error.message
            });
        }


        res.json(data);

    } catch (error) {

        console.error(
            "GET error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ========================================
// ADD TASK
// ========================================

app.post("/api/tasks", async (req, res) => {

    try {

        console.log("POST request received");
        console.log("Request body:", req.body);


        const {
            text,
            priority,
            due_date
        } = req.body;


        // Validate text

        if (!text || text.trim() === "") {

            return res.status(400).json({
                message: "Task text is required"
            });

        }


        // Validate priority

        const allowedPriorities = [
            "low",
            "medium",
            "high"
        ];


        const selectedPriority =
            allowedPriorities.includes(priority)
                ? priority
                : "medium";


        const { data, error } = await supabase
            .from("tasks")
            .insert({

                text: text.trim(),

                completed: false,

                priority: selectedPriority,

                due_date: due_date || null

            })
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase INSERT error:",
                error
            );

            return res.status(500).json({
                message: error.message
            });

        }


        console.log(
            "Task inserted successfully:",
            data
        );


        res.status(201).json(data);


    } catch (error) {

        console.error(
            "POST error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ========================================
// UPDATE TASK
// ========================================

app.put("/api/tasks/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            text,
            completed,
            priority,
            due_date
        } = req.body;


        const updateData = {};


        // Update text only if provided

        if (text !== undefined) {

            if (!text.trim()) {

                return res.status(400).json({
                    message: "Task text cannot be empty"
                });

            }

            updateData.text = text.trim();

        }


        // Update completed status

        if (completed !== undefined) {

            updateData.completed = completed;

        }


        // Update priority

        if (priority !== undefined) {

            const allowedPriorities = [
                "low",
                "medium",
                "high"
            ];


            if (
                !allowedPriorities.includes(priority)
            ) {

                return res.status(400).json({
                    message: "Invalid priority"
                });

            }


            updateData.priority = priority;

        }


        // Update due date

        if (due_date !== undefined) {

            updateData.due_date =
                due_date || null;

        }


        // Make sure something is being updated

        if (Object.keys(updateData).length === 0) {

            return res.status(400).json({
                message: "No fields to update"
            });

        }


        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase UPDATE error:",
                error
            );

            return res.status(500).json({
                message: error.message
            });

        }


        res.json(data);


    } catch (error) {

        console.error(
            "PUT error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ========================================
// DELETE TASK
// ========================================

app.delete("/api/tasks/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const { data, error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .select()
            .single();


        if (error) {

            console.error(
                "Supabase DELETE error:",
                error
            );

            return res.status(500).json({
                message: error.message
            });

        }


        res.json({

            message: "Task deleted successfully",

            task: data

        });


    } catch (error) {

        console.error(
            "DELETE error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});