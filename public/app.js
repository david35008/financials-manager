const path = require('path');
const express = require("express");
const morgan = require('morgan');
const { v4: uuid } = require('uuid');
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
const DBPath = rootDirectory + "/data.json";

function isNullOrUndefined(value) {
    return value === undefined || value === null;
}

async function readDb() {
    console.log('Read DataBase')
    const content = await fs.readFile(DBPath);
    return JSON.parse(content);
}

async function writeDb(jsonContent) {
    console.log('Write DataBase')
    const stringContent = JSON.stringify(jsonContent);
    await fs.writeFile(DBPath, stringContent);
}

async function initDb() {
    console.log('Init DataBase')
    await writeDb({})
}

async function validateDbReady() {
    try {
        await readDb()
        console.log('DataBase is ready to use')
    } catch (err) {
        if (err.code === "ENOENT") {
            await initDb()
        }
    }
}

async function ensureDirSync(dirpath) {
    console.log(`Validate folder "${dirpath}" exist`)
    try {
        await fs.mkdir(dirpath);
    } catch (err) {
        if (err.code === "EEXIST") return;
        else console.log(err);
    }
}

function uniqId() {
    const newId = uuid();
    console.log(`Generating new Id "${newId}"`)
    return newId;
}

async function AddTable(tableName) {
    const data = await readDb()
    if (!isNullOrUndefined(data[tableName])) {
        return false
    } else {
        data[tableName] = {};
    }
    await writeDb(data)
}

async function getTable(tableName) {
    const data = await readDb()
    const tableData = data[tableName];
    if (isNullOrUndefined(tableData)) return false
    return tableData
}

async function getRowFromTable(table, id) {
    const data = await readDb()
    if (isNullOrUndefined(data[table])) return false;
    return data[table][id]
}

async function AddRowToTable(table, id, newData) {
    const data = await readDb()
    if (isNullOrUndefined(data[table])) return false;
    if (!isNullOrUndefined(data[table][id])) return false;
    data[table][id] = newData;
    await writeDb(data)
    return newData
}

async function editRowInTable(table, id, newData) {
    const data = await readDb()
    if (isNullOrUndefined(data[table])) return false;
    if (isNullOrUndefined(data[table][id])) return false;
    data[table][id] = newData;
    await writeDb(data)
    return newData
}

async function deleteRoeFromTable(table, id) {
    const data = await readDb()
    if (isNullOrUndefined(data[table])) return false;
    if (isNullOrUndefined(data[table][id])) return false;
    delete data[table][id]
    await writeDb(data)
    return true
}


app.get("/api/start", async (req, res) => {
    await ensureDirSync(rootDirectory);
    await validateDbReady();
    const data = await readDb()
    res.json(data);
});

app.get("/api/reset-data-base", async (req, res) => {
    console.log('Resting DataBase')
    await writeDb({})
    const data = await readDb()
    res.json(data);
});

app.get("/api/table", async (req, res) => {
    const data = await readDb();
    res.json(data);
});

app.get("/api/table/:tableName", async (req, res) => {
    const { tableName } = req.params;
    const tableData = await getTable(tableName);
    if (tableData) {
        return res.json(tableData);
    }
    return res.status(404).json({ message: `Table "${tableName}" Not Found` });
});

app.post("/api/table", async (req, res) => {
    const { tableName } = req.body;
    const tableData = await AddTable(tableName);
    res.json(tableData);
});

app.get("/api/item/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    const resp = await getRowFromTable(tableName, id);
    if (resp) {
        return res.json(resp);
    }
    return res.status(404).json({ message: `Item "${id}" of table: "${tableName}" Not Found` });
});

app.post("/api/item/:tableName", async (req, res) => {
    const { tableName } = req.params;
    const data = req.body;
    const id = uniqId();
    const resp = await AddRowToTable(tableName, id, data);
    if (resp) {
        return res.json(resp);
    }
    return res.status(400).json({ message: 'Cannot process request' });
});

app.put("/api/item/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    const data = req.body;
    const resp = await editRowInTable(tableName, id, data);
    if (resp) {
        return res.json(resp);
    }
    return res.status(404).json({ message: `Item "${id}" of table: "${tableName}" Not Found` });
});

app.delete("/api/item/:tableName/:id", async (req, res) => {
    const { tableName, id } = req.params;
    const resp = await deleteRoeFromTable(tableName, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Item "${id}" of table: "${tableName}" Not Found` });
});

module.exports = app;
