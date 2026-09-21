const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
    res.send("Task Tracker API is running");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Supabase GET error:", error);
            return res.status(500).json({
                message: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error("GET error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

// Add a task
app.post("/api/tasks", async (req, res) => {
    try {
        console.log("POST request received");
        console.log("Request body:", req.body);

        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Task text is required"
            });
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                text: text.trim(),
                completed: false
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase INSERT error:", error);

            return res.status(500).json({
                message: error.message
            });
        }

        console.log("Task inserted successfully:", data);

        res.status(201).json(data);
    } catch (error) {
        console.error("POST error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

// Update task
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const { data, error } = await supabase
            .from("tasks")
            .update({
                completed: completed
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase UPDATE error:", error);

            return res.status(500).json({
                message: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error("PUT error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

// Delete task
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
            console.error("Supabase DELETE error:", error);

            return res.status(500).json({
                message: error.message
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: data
        });
    } catch (error) {
        console.error("DELETE error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});