const express = require("express");
const fs = require("fs").promises;
const morgan = require("morgan");

const app = express();
app.use(express.json());

// const Cryptr = require('cryptr');
// const cryptr = new Cryptr('b36b1759238bed767e28d32af4a846ba6f7e94e1f00618b1cd4c6fa8f4812af882822a62a198ebe489');

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
const COINS = 'coins'
const COUNTRIES = 'countries'

const tableStructure = {
    version: "1.0",
    migrations: {},
    institutes: {},
    investors: {},
    investments: {},
    investments_types: {},
    investments_route: {},
    coins: {},
    countries: {},
}


function now() {
    return new Date().getTime()
}

function isObject(element) {
    if (element) {
        return Object.getPrototypeOf(element) === Object.getPrototypeOf({}) && !Array.isArray(element);
    }
    return false
}

function isEmpty(value) {
    if (value === undefined || value === null) return true
    if (Array.isArray(value) && value.length === 0) return true
    return !!(isObject(value) && Object.keys(value).length === 0);
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
    let content = JSON.stringify(jsonContent, null, 2);
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

async function ensureDirSync(dirPath) {
    console.log(`ENV mode Production ${isProduction}:  Validate folder "${dirPath}" exist`)
    try {
        await fs.mkdir(dirPath);
    } catch (err) {
        if (err.code === "EEXIST") return;
        console.log(err);
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

async function GetTable(table) {
    const db = await readDb()
    return db[table] || {};
}

async function ListTable(table) {
    const db = await readDb()
    let tableResults = db[table] || {};
    for (const entry of Object.values(tableResults)) {
        formatEntryDates(entry)
    }
    return tableResults
}

function formatEntryDates(entry) {
    let keys = ['created_at', 'updated_at'];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (entry[key]) {
            entry[key] = new Date(entry[key]).toLocaleString()
        }
    }
    entry['as_of_date_view'] = new Date(entry['as_of_date']).toLocaleString()
}

async function GetEntry(table, id) {
    const db = await readDb()
    const entry = db[table][id]
    formatEntryDates(entry);
    if (!entry) return false
    return { id, ...entry }
}

async function CreateEntry(table, newData) {
    const db = await readDb()
    const allValues = db[table]
    let allIds = Object.keys(allValues)
    if (isEmpty(allIds)) {
        allIds = [0]
    }
    const nextId = Math.max(...allIds) + 1
    db[table][nextId] = { ...newData, created_at: now(), updated_at: now() };
    await writeDb(db)
    return { id: nextId, ...newData }
}

async function UpdateEntry(table, id, updatedData) {
    const db = await readDb()
    updatedData = { ...db[table][id], ...updatedData, 'updated_at': now() };
    db[table][id] = updatedData;
    await writeDb(db)
    return { id, ...updatedData }
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
    return investments.filter(x => x.institute == institute)
}

async function getInvestorInvestments(investor) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    return investments.filter(x => x.investor == investor)
}

async function getInvestmentsTypeInvestments(investmentsType) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    return investments.filter(x => x.investments_type == investmentsType)
}

async function getInvestmentsRouteInvestments(investmentsRoute) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    return investments.filter(x => x.investments_route == investmentsRoute)
}

async function getCoinInvestments(coin) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    return investments.filter(x => x.coin == coin)
}

async function getCountryInvestments(country) {
    const investmentsDB = await ListTable(INVESTMENTS)
    const investments = dictToList(investmentsDB)
    return investments.filter(x => x.country == country)
}

async function modelToConfig(modelName) {
    const entities = await ListTable(modelName)
    const respDict = {}
    for (const [key, valueDict] of Object.entries(entities)) {
        respDict[key] = valueDict['name']
    }
    return respDict
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
    const { name } = req.body;
    const instituteData = await UpdateEntry(INSTITUTES, id, { name });
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

// -------------------- investment routes ---------------------------

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

// -------------------- coins ---------------------------

app.get("/api/coin", async (req, res) => {
    const data = await ListTable(COINS);
    res.json(data);
});

app.get("/api/coin/:id", async (req, res) => {
    const { id } = req.params;
    const coinsData = await GetEntry(COINS, id);
    if (coinsData) {
        return res.json(coinsData);
    }
    return res.status(404).json({ message: `Coin "${id}" Not Found` });
});

app.post("/api/coin", async (req, res) => {
    const { name, suffix } = req.body;
    const coinsData = await CreateEntry(COINS, { name, suffix });
    res.json(coinsData);
});

app.put("/api/coin/:id", async (req, res) => {
    const { id } = req.params;
    const { name, suffix } = req.body;
    const coinsData = await UpdateEntry(COINS, id, { name, suffix });
    res.json(coinsData);
});

app.delete("/api/coin/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(COINS, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Coin "${id}" Not Found` });
});

// -------------------- country ---------------------------

app.get("/api/country", async (req, res) => {
    const data = await ListTable(COUNTRIES);
    res.json(data);
});

app.get("/api/country/:id", async (req, res) => {
    const { id } = req.params;
    const countriesData = await GetEntry(COUNTRIES, id);
    if (countriesData) {
        return res.json(countriesData);
    }
    return res.status(404).json({ message: `country "${id}" Not Found` });
});

app.post("/api/country", async (req, res) => {
    const { name, suffix } = req.body;
    const countriesData = await CreateEntry(COUNTRIES, { name, suffix });
    res.json(countriesData);
});

app.put("/api/country/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const countriesData = await UpdateEntry(COUNTRIES, id, { name });
    res.json(countriesData);
});

app.delete("/api/country/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(COUNTRIES, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `country "${id}" Not Found` });
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
    if (obj.coin) {
        const coinObj = await GetEntry(COINS, obj.coin)
        obj['coin_name'] = coinObj.name
        obj['coin_suffix'] = coinObj.suffix
    }
    if (obj.country) {
        const countryObj = await GetEntry(COINS, obj.country)
        obj['country_name'] = countryObj.name
    }
    return obj
}

app.get("/api/investment/by-institute", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)
    const institutes = await modelToConfig(INSTITUTES)

    const institutesNames = Object.values(institutes)
    const investmentByInstitute = {}

    for (const investment of Object.values(investments)) {
        if (!investment.institute) continue
        const instituteName = institutes[investment.institute]
        if (!investmentByInstitute[instituteName]) {
            investmentByInstitute[instituteName] = {}
        }

        const institute = investmentByInstitute[instituteName]
        const coinName = coins[investment.coin]

        if (!institute[coinName]) {
            institute[coinName] = 0
        }

        institute[coinName] += investment.amount
    }

    const respInstitute = {
        labels: institutesNames,
        data: investmentByInstitute
    }
    return res.json(respInstitute);
});

app.get("/api/investment/by-institute/:instituteId", async (req, res) => {
    const { instituteId } = req.params;
    const instituteData = await getInstituteInvestments(instituteId);
    for (let i = 0; i < instituteData.length; i++) {
        await fetchRelated(instituteData[i]);
    }
    return res.json(instituteData);
});

app.get("/api/investment/sum-by-institute/:instituteId", async (req, res) => {
    const { instituteId } = req.params;
    const instituteData = await getInstituteInvestments(instituteId);
    const coins = await GetTable(COINS)
    const moneySum = {}
    for (const investment of instituteData) {
        const coin = coins[investment.coin]
        if (!moneySum[investment.coin]) {
            moneySum[investment.coin] = { ...coin, amount: 0 }
        }
        moneySum[investment.coin].amount += investment.amount
    }
    return res.json(moneySum);
});

app.get("/api/investment/by-investor", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)
    const investors = await modelToConfig(INVESTORS)

    const investorsNames = Object.values(investors)
    const investmentByInvestor = {}

    for (const investment of Object.values(investments)) {
        if (!investment.investor) continue
        const investorName = investors[investment.investor]
        if (!investmentByInvestor[investorName]) {
            investmentByInvestor[investorName] = {}
        }

        const investor = investmentByInvestor[investorName]
        const coinName = coins[investment.coin]

        if (!investor[coinName]) {
            investor[coinName] = 0
        }

        investor[coinName] += investment.amount
    }

    const respInvestor = {
        labels: investorsNames,
        data: investmentByInvestor
    }
    return res.json(respInvestor);
});

app.get("/api/investment/by-investor/:investorId", async (req, res) => {
    const { investorId } = req.params;
    const investorData = await getInvestorInvestments(investorId);
    for (let i = 0; i < investorData.length; i++) {
        await fetchRelated(investorData[i]);
    }
    return res.json(investorData);
});

app.get("/api/investment/by-investments-type", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)
    const investmentsTypes = await modelToConfig(INVESTMENTS_TYPES)

    const investmentsTypesNames = Object.values(investmentsTypes)
    const investmentByInvestmentsType = {}

    for (const investment of Object.values(investments)) {
        if (!investment.investments_type) continue
        const investmentsTypeName = investmentsTypes[investment.investments_type]
        if (!investmentByInvestmentsType[investmentsTypeName]) {
            investmentByInvestmentsType[investmentsTypeName] = {}
        }

        const investmentsType = investmentByInvestmentsType[investmentsTypeName]
        const coinName = coins[investment.coin]

        if (!investmentsType[coinName]) {
            investmentsType[coinName] = 0
        }

        investmentsType[coinName] += investment.amount
    }

    const respInvestmentsType = {
        labels: investmentsTypesNames,
        data: investmentByInvestmentsType
    }
    return res.json(respInvestmentsType);
});

app.get("/api/investment/by-investments-type/:investmentsTypeId", async (req, res) => {
    const { investmentsTypeId } = req.params;
    const investmentsTypeData = await getInvestmentsTypeInvestments(investmentsTypeId);
    for (let i = 0; i < investmentsTypeData.length; i++) {
        await fetchRelated(investmentsTypeData[i]);
    }
    return res.json(investmentsTypeData);
});

app.get("/api/investment/by-investments-route", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)
    const investmentsRoutes = await modelToConfig(INVESTMENTS_ROUTE)

    const investmentsRoutesNames = Object.values(investmentsRoutes)
    const investmentByInvestmentsRoute = {}

    for (const investment of Object.values(investments)) {
        if (!investment.investments_route) continue
        const investmentsRouteName = investmentsRoutes[investment.investments_route]
        if (!investmentByInvestmentsRoute[investmentsRouteName]) {
            investmentByInvestmentsRoute[investmentsRouteName] = {}
        }

        const investmentsRoute = investmentByInvestmentsRoute[investmentsRouteName]
        const coinName = coins[investment.coin]

        if (!investmentsRoute[coinName]) {
            investmentsRoute[coinName] = 0
        }

        investmentsRoute[coinName] += investment.amount
    }

    const respInvestmentsRoute = {
        labels: investmentsRoutesNames,
        data: investmentByInvestmentsRoute
    }
    return res.json(respInvestmentsRoute);
});

app.get("/api/investment/by-investments-route/:investmentsRouteId", async (req, res) => {
    const { investmentsRouteId } = req.params;
    const investmentsRouteData = await getInvestmentsRouteInvestments(investmentsRouteId);
    for (let i = 0; i < investmentsRouteData.length; i++) {
        await fetchRelated(investmentsRouteData[i]);
    }
    return res.json(investmentsRouteData);
});

app.get("/api/investment/by-coin/:coinId", async (req, res) => {
    const { coinId } = req.params;
    const coinData = await getCoinInvestments(coinId);
    for (let i = 0; i < coinData.length; i++) {
        await fetchRelated(coinData[i]);
    }
    return res.json(coinData);
});

app.get("/api/investment/sum-by-coin/:coinId", async (req, res) => {
    const { coinId } = req.params;
    const coinData = await getCoinInvestments(coinId);
    let moneySum = 0
    for (const investment of coinData) {
        moneySum += investment.amount
    }
    return res.json(moneySum);
});

app.get("/api/investment/by-country", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)
    const countries = await modelToConfig(COUNTRIES)

    const countriesNames = Object.values(countries)
    const investmentByCountry = {}

    for (const investment of Object.values(investments)) {
        if (!investment.country) continue
        const countryName = countries[investment.country]
        if (!investmentByCountry[countryName]) {
            investmentByCountry[countryName] = {}
        }

        const country = investmentByCountry[countryName]
        const coinName = coins[investment.coin]

        if (!country[coinName]) {
            country[coinName] = 0
        }

        country[coinName] += investment.amount
    }

    const respCountry = {
        labels: countriesNames,
        data: investmentByCountry
    }
    return res.json(respCountry);
});

app.get("/api/investment/by-country/:countryId", async (req, res) => {
    const { countryId } = req.params;
    const countryData = await getCountryInvestments(countryId);
    for (let i = 0; i < countryData.length; i++) {
        await fetchRelated(countryData[i]);
    }
    return res.json(countryData);
});

app.get("/api/investment/by-ticker", async (req, res) => {
    const investments = await ListTable(INVESTMENTS)
    const coins = await modelToConfig(COINS)

    const investmentByTicker = {}
    const labels = []
    for (const investment of Object.values(investments)) {
        if (!investment.ticker) continue
        const tickerName = investment.ticker
        if (!investmentByTicker[tickerName]) {
            labels.push(tickerName)
            investmentByTicker[tickerName] = {}
        }

        const ticker = investmentByTicker[tickerName]
        const coinName = coins[investment.coin]

        if (!ticker[coinName]) {
            ticker[coinName] = 0
        }

        ticker[coinName] += investment.amount
    }

    const respCountry = {
        labels,
        data: investmentByTicker
    }
    return res.json(respCountry);
});

app.post("/api/investment", async (req, res) => {
    const { institute, investor, investments_type, investments_route,
        amount, coin, ticker, country, as_of_date } = req.body;
    const investmentsData = await CreateEntry(INVESTMENTS, {
        institute,
        investor,
        investments_type,
        investments_route,
        coin,
        ticker,
        country,
        as_of_date: as_of_date || now(),
        amount: parseFloat(amount)
    });
    res.json(investmentsData);
});

app.put("/api/investment/:id", async (req, res) => {
    const { id } = req.params;
    const { institute, investor, investments_type, investments_route,
        amount, coin, ticker, country, as_of_date } = req.body;
    const investmentsData = await UpdateEntry(INVESTMENTS, id, {
        institute,
        investor,
        investments_type,
        investments_route,
        coin,
        ticker,
        country,
        as_of_date: as_of_date || now(),
        amount: parseFloat(amount)
    });
    res.json(investmentsData);
});

app.delete("/api/investment/:id", async (req, res) => {
    const { id } = req.params;
    const resp = await DeleteEntry(INVESTMENTS, id);
    if (resp) {
        return res.status(204).send("Delete successfully");
    }
    return res.status(404).json({ message: `Investments "${id}" Not Found` });
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
