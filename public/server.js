const express = require("express");
const fs = require("fs").promises;
const morgan = require("morgan");

const app = express();
app.use(express.json());

// const Cryptr = require('cryptr');
// const cryptr = new Cryptr('b36b1759238bbed767e28d32af4a846ba6f7e94e1f00618b1cd4c6fa8f4812af882822a62a198eebe489');

const morganMiddleware = morgan((tokens, req, res) => {
    const myTiny = [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'];
    return myTiny.join(' ');
});
app.use(morganMiddleware)

const isProduction = process.env.NODE_ENV === "production"
const fileDevelopment = "/data.json"
const fileProduction = "/data.json"
const fileName = isProduction ? fileProduction : fileDevelopment
const prodDirectory = "C:/DB";
let directory = prodDirectory
// if (!isProduction) {
//     const path = require("path");
//     directory = path.resolve(__dirname, '..')
// }
const DBPath = directory + fileName;


const INSTITUTES = 'institutes'
const INVESTORS = 'investors'
const INVESTMENTS = 'investments'
const INVESTMENTS_TYPES = 'investments_types'
const INVESTMENTS_ROUTE = 'investments_route'

const tableStructure = {
    institutes: {},
    investors: {},
    investments: {},
    investments_types: {},
    investments_route: {},
}


function now() {
    return new Date().getTime()
}

function isObject(element) {
    if (element) {
        return Object.getPrototypeOf(element) === Object.getPrototypeOf(new Object()) && !Array.isArray(element);
    }
    return false
}

function isEmpty(value) {
    if (value === undefined || value === null) return true
    if (Array.isArray(value) && value.length == 0) return true
    if (isObject(value) && Object.keys(value).length == 0) return true
    return false;
}

async function readDb() {
    console.log('Read DataBase')
    let content = await fs.readFile(DBPath);
    // if (isProduction) {
    //     content = cryptr.decrypt(content);
    // }
    return JSON.parse(content);
}

async function writeDb(jsonContent) {
    console.log('Write DataBase')
    let content = JSON.stringify(jsonContent, 0, 2);
    // if (isProduction) {
    //     content = cryptr.encrypt(content);
    // }
    await fs.writeFile(DBPath, content);
}

async function initDb() {
    console.log('Init DataBase')
    await writeDb(tableStructure)
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
    console.log(`ENV mode Production ${isProduction}:  Validate folder "${dirpath}" exist`)
    try {
        await fs.mkdir(dirpath);
    } catch (err) {
        if (err.code === "EEXIST") return;
        else console.log(err);
    }
}

app.get("/api/start", async (req, res) => {
    await ensureDirSync(directory);
    await validateDbReady();
    res.sendStatus(200);
});

app.get("/api/reset-data-base", async (req, res) => {
    console.log('Resting DataBase')
    await writeDb({})
    const data = await readDb()
    res.json(data);
});

async function ListTable(table) {
    const db = await readDb()
    let tableResults = db[table] || {};
    for (const entry of Object.values(tableResults)) {
        formatEntryDates(entry)
    }
    return tableResults
}

function formatEntryDates(entry) {
    let keys = ['created_at', 'updated_at', 'as_of_date'];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (entry[key]) {
            entry[key] = new Date(entry[key]).toDateString()
        }
    }
}

async function GetEntry(table, id) {
    const db = await readDb()
    const entrry = db[table][id]
    formatEntryDates(entrry);
    if (!entrry) return false
    return { id, ...entrry }
}

async function CreateEntry(table, newData) {
    const db = await readDb()
    const allVals = db[table]
    let allIds = Object.keys(allVals)
    if (isEmpty(allIds)) {
        allIds = [0]
    }
    const nextId = Math.max(...allIds) + 1
    db[table][nextId] = {...newData, created_at: now(), updated_at: now()};
    await writeDb(db)
    return { id: nextId, ...newData }
}

async function UpdateEntry(table, id, updatedData) {
    const db = await readDb()
    db[table][id] = updatedData;
    await writeDb(db)
    return { id, ...updatedData, updated_at: now() }
}

async function DeleteEntry(table, id) {
    const db = await readDb()
    if (!db[table][id]) return false
    delete db[table][id]
    await writeDb(db)
    return true
}

function dictToList(dict) {
    const list = []
    for (const [key, value] of Object.entries(dict)) {
        list.push({ id: key, ...value })
    }
    return list
}

async function getInstituteInvestments(institute) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    const filteredInvestments = investments.filter(x => x.institute == institute)
    return filteredInvestments
}

async function getInvestorInvestments(investor) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    const filteredInvestments = investments.filter(x => x.investor == investor)
    return filteredInvestments
}

async function getInvestmentsTypeInvestments(investmentsType) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    const filteredInvestments = investments.filter(x => x.investments_type == investmentsType)
    return filteredInvestments
}

// --------------------institutes ---------------------------

app.get("/api/institute", async (req, res) => {
    const data = await ListTable(INSTITUTES);
    res.json(data);
});

app.get("/api/institute/:id", async (req, res) => {
    const { id } = req.params;
    const instituteData = await GetEntry(INSTITUTES, id);
    if (instituteData) {
        return res.json(instituteData);
    }
    return res.status(404).json({ message: `Institute "${id}" Not Found` });
});

app.post("/api/institute", async (req, res) => {
    const { name } = req.body;
    const instituteData = await CreateEntry(INSTITUTES, { name });
    res.json(instituteData);
});

app.put("/api/institute/:id", async (req, res) => {
    const { id } = req.params;
    const { instituteName } = req.body;
    const instituteData = await UpdateEntry(INSTITUTES, id, { name: instituteName });
    res.json(instituteData);
});

app.delete("/api/institute/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(INSTITUTES, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Institute "${id}" Not Found` });
});

// -------------------- investors ---------------------------

app.get("/api/investor", async (req, res) => {
    const data = await ListTable(INVESTORS);
    res.json(data);
});

app.get("/api/investor/:id", async (req, res) => {
    const { id } = req.params;
    const investorData = await GetEntry(INVESTORS, id);
    if (investorData) {
        return res.json(investorData);
    }
    return res.status(404).json({ message: `Investor "${id}" Not Found` });
});

app.post("/api/investor", async (req, res) => {
    const { name } = req.body;
    const investorData = await CreateEntry(INVESTORS, { name });
    res.json(investorData);
});

app.put("/api/investor/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const investorData = await UpdateEntry(INVESTORS, id, { name });
    res.json(investorData);
});

app.delete("/api/investor/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(INVESTORS, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Investor "${id}" Not Found` });
});

// -------------------- investment types ---------------------------

app.get("/api/investments-type", async (req, res) => {
    const data = await ListTable(INVESTMENTS_TYPES);
    res.json(data);
});

app.get("/api/investments-type/:id", async (req, res) => {
    const { id } = req.params;
    const investmentsTypeData = await GetEntry(INVESTMENTS_TYPES, id);
    if (investmentsTypeData) {
        return res.json(investmentsTypeData);
    }
    return res.status(404).json({ message: `Investments Type "${id}" Not Found` });
});

app.post("/api/investments-type", async (req, res) => {
    const { name } = req.body;
    const investmentsTypeData = await CreateEntry(INVESTMENTS_TYPES, { name });
    res.json(investmentsTypeData);
});

app.put("/api/investments-type/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const investmentsTypeData = await UpdateEntry(INVESTMENTS_TYPES, id, { name });
    res.json(investmentsTypeData);
});

app.delete("/api/investments-type/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(INVESTMENTS_TYPES, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Investments Type "${id}" Not Found` });
});

// -------------------- investment types ---------------------------

app.get("/api/investments-route", async (req, res) => {
    const data = await ListTable(INVESTMENTS_ROUTE);
    res.json(data);
});

app.get("/api/investments-route/:id", async (req, res) => {
    const { id } = req.params;
    const investmentsRouteData = await GetEntry(INVESTMENTS_ROUTE, id);
    if (investmentsRouteData) {
        return res.json(investmentsRouteData);
    }
    return res.status(404).json({ message: `Investments Route "${id}" Not Found` });
});

app.post("/api/investments-route", async (req, res) => {
    const { name } = req.body;
    const investmentsRouteData = await CreateEntry(INVESTMENTS_ROUTE, { name });
    res.json(investmentsRouteData);
});

app.put("/api/investments-route/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const investmentsRouteData = await UpdateEntry(INVESTMENTS_ROUTE, id, { name });
    res.json(investmentsRouteData);
});

app.delete("/api/investments-route/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(INVESTMENTS_ROUTE, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Investments Route "${id}" Not Found` });
});

// -------------- investments ------------------------

async function fetchRelated(obj) {
    if (obj.institute) {
        const instituteObj = await GetEntry(INSTITUTES, obj.institute)
        obj['institute_name'] = instituteObj.name
    }
    if (obj.investor) {
        const investorObj = await GetEntry(INVESTORS, obj.investor)
        obj['investor_name'] = investorObj.name
    }
    if (obj.investments_type) {
        const investmentsTypeObj = await GetEntry(INVESTMENTS_TYPES, obj.investments_type)
        obj['investments_type_name'] = investmentsTypeObj.name
    }
    if (obj.investments_route) {
        const investmentsRouteObj = await GetEntry(INVESTMENTS_ROUTE, obj.investments_route)
        obj['investments_route_name'] = investmentsRouteObj.name
    }
    return obj
}

app.get("/api/investment/by-institute/:instituteId", async (req, res) => {
    const { instituteId } = req.params;
    const instituteData = await getInstituteInvestments(instituteId);
    for (let i = 0; i < instituteData.length; i++) {
        await fetchRelated(instituteData[i]);
    }
    return res.json(instituteData);
});

app.get("/api/investment/by-investor/:investorId", async (req, res) => {
    const { investorId } = req.params;
    const investorData = await getInvestorInvestments(investorId);
    for (let i = 0; i < investorData.length; i++) {
        await fetchRelated(investorData[i]);
    }
    return res.json(investorData);
});

app.get("/api/investment/by-investments-type/:investmentsTypeId", async (req, res) => {
    const { investmentsTypeId } = req.params;
    const investmentsTypeData = await getInvestmentsTypeInvestments(investmentsTypeId);
    for (let i = 0; i < investmentsTypeData.length; i++) {
        await fetchRelated(investmentsTypeData[i]);
    }
    return res.json(investmentsTypeData);
});

app.post("/api/investment", async (req, res) => {
    const { institute, investor, investments_type, investments_route, amount, as_of_date} = req.body;
    const investmentsData = await CreateEntry(INVESTMENTS, {
        institute,
        investor,
        investments_type,
        investments_route,
        as_of_date: as_of_date || now(),
        amount: parseFloat(amount)
    });
    res.json(investmentsData);
});

app.get("/api/investment/money-sum", async (req, res) => {
    const investmentsData = await ListTable(INVESTMENTS)
    let moneySum = 0
    for (const investment of Object.values(investmentsData)) {
        moneySum += investment.amount
    }
    return res.json(moneySum);
});

app.get("/api/investment", async (req, res) => {
    const investmentsData = await ListTable(INVESTMENTS)
    const investmentsDataList = dictToList(investmentsData)
    for (let i = 0; i < investmentsDataList.length; i++) {
        await fetchRelated(investmentsDataList[i]);
    }
    return res.json(investmentsDataList);
});


const port = 9000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
