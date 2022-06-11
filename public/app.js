const path = require('path');
const express = require("express");
const morgan = require('morgan');
const app = express();
app.use(express.json());

const morganMiddleware = morgan((tokens, req, res) => {
    const myTiny = [tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'];
    return myTiny.join(' ');
});
app.use(morganMiddleware)

const fs = require("fs").promises;
const rootDirectory = path.resolve(__dirname, '..')
const filePath = rootDirectory + "/data.json";

const basicContent = { categories: [], shortcuts: [] };

let staticContent;

async function validateDbReady() {
    try {
        const content = await fs.readFile(filePath);
        staticContent = JSON.parse(content);
    } catch (err) {
        if (err.code === "ENOENT") {
            staticContent = basicContent;
            await fs.writeFile(filePath, JSON.stringify(basicContent));
        }
    }
}

app.get("/api/start", async (req, res) => {
    await ensureDirSync(rootDirectory);
    await validateDbReady();
    res.json(staticContent);
});

async function ensureDirSync(dirpath) {
    try {
        await fs.mkdir(dirpath);
    } catch (err) {
        if (err.code === "EEXIST") return;
        else console.log(err);
    }
}
function uniqid() {
    return new Date().valueOf().toString();
}
function readData(key) {
    if (staticContent) {
        if (key) {
            return staticContent[key];
        } else {
            return staticContent;
        }
    }
    return [];
}
async function saveData() {
    try {
        fs.writeFile(filePath, JSON.stringify(staticContent));
    } catch (error) {
        console.log("saveData function-", error);
    }
}
async function deleteElement(key, id) {
    if (staticContent[key]) {
        const index = staticContent[key].findIndex((element) => element.id === id);
        if (index !== -1) {
            staticContent[key].splice(index, 1);
            await saveData();
            return true;
        }
    }
    return false;
}
async function editElement(key, id, newData) {
    if (staticContent[key]) {
        const index = staticContent[key].findIndex((element) => element.id === id);
        if (index !== -1) {
            console.log(staticContent[key][index]);
            console.log(newData);
            staticContent[key][index] = { ...staticContent[key][index], ...newData };
            await saveData();
            return true;
        }
    }
    return false;
}

async function AddElement(data, key) {
    if (staticContent[key]) {
        staticContent[key].push(data);
    } else {
        staticContent[key] = [data];
    }
    await saveData();
}

app.get("/api/categories", async (req, res) => {
    const categories = readData("categories");
    res.json(categories);
});

app.post("/api/categories", async (req, res) => {
    const { name } = req.body;
    if (name) {
        const id = uniqid();
        await AddElement({ id, name }, "categories");
        res.send("added successfully");
    } else {
        res.send("category name is empty");
    }
});

app.delete("/api/categories/:id", async (req, res) => {
    const success = await deleteElement("categories", req.params.id);
    if (success) {
        res.send("deleted successfully");
    } else {
        res.send("item not found");
    }
});

app.put("/api/categories/:id", async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const success = await editElement("categories", id, { name });
    if (success) {
        res.send("edit successfully");
    } else {
        res.send("item not found");
    }
});

app.get("/api/shortcuts/:categoryId", async (req, res) => {
    const shortcuts = readData("shortcuts");
    const shortcutsByCategory = shortcuts.filter(
        (shortcut) => shortcut.categoryId === req.params.categoryId
    );
    res.json(shortcutsByCategory);
});
app.post("/api/shortcuts", async (req, res) => {
    const { shortcut, categoryId, description } = req.body;
    const id = uniqid();
    await AddElement({ id, shortcut, categoryId, description }, "shortcuts");
    res.send("added successfully");
});
app.delete("/api/shortcuts/:id", async (req, res) => {
    const success = await deleteElement("shortcuts", req.params.id);
    if (success) {
        res.send("deleted successfully");
    } else {
        res.send("item not found");
    }
});
app.put("/api/shortcuts/:id", async (req, res) => {
    const id = req.params.id;
    const { name, shortcut, description } = req.body;
    const success = await editElement(
        "shortcuts",
        id,
        JSON.parse(JSON.stringify({ name, shortcut, description }))
    );
    if (success) {
        res.send("edit successfully");
    } else {
        res.send("item not found");
    }
});

module.exports = app;
