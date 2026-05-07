import { mkdir, rm, writeFile } from 'node:fs/promises'

const EU_COUNTRIES = [
  ['AT', 'Austria'],
  ['BE', 'Belgium'],
  ['BG', 'Bulgaria'],
  ['HR', 'Croatia'],
  ['CY', 'Cyprus'],
  ['CZ', 'Czechia'],
  ['DK', 'Denmark'],
  ['EE', 'Estonia'],
  ['FI', 'Finland'],
  ['FR', 'France'],
  ['DE', 'Germany'],
  ['EL', 'Greece'],
  ['HU', 'Hungary'],
  ['IE', 'Ireland'],
  ['IT', 'Italy'],
  ['LV', 'Latvia'],
  ['LT', 'Lithuania'],
  ['LU', 'Luxembourg'],
  ['MT', 'Malta'],
  ['NL', 'Netherlands'],
  ['PL', 'Poland'],
  ['PT', 'Portugal'],
  ['RO', 'Romania'],
  ['SK', 'Slovakia'],
  ['SI', 'Slovenia'],
  ['ES', 'Spain'],
  ['SE', 'Sweden'],
]

const YEARS = ['2014', '2019']
const DATA_API =
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
const MAP_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/countries/topojson/CNTR_RG_20M_2020_4326.json'
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/alpha'
const RAW_DATA_DIR = 'public/data/raw'

const SEX_GROUPS = [
  { id: 'M', label: 'Males' },
  { id: 'F', label: 'Females' },
]
const INCOME_QUINTILES = [
  { id: 'QU1', label: 'First quintile' },
  { id: 'QU2', label: 'Second quintile' },
  { id: 'QU3', label: 'Third quintile' },
  { id: 'QU4', label: 'Fourth quintile' },
  { id: 'QU5', label: 'Fifth quintile' },
]
const GROUP_AGES = [
  { id: 'Y18-24', label: 'From 18 to 24 years' },
  { id: 'Y55-64', label: 'From 55 to 64 years' },
  { id: 'Y65-74', label: 'From 65 to 74 years' },
  { id: 'Y_GE75', label: '75 years or over' },
]
const INCOME_AGE_CODES = [
  'Y_LT6',
  'Y6-10',
  'Y6-11',
  'Y11-15',
  'Y12-17',
  'Y_LT16',
  'Y16-24',
  'Y16-64',
  'Y_GE16',
  'Y_LT18',
  'Y18-24',
  'Y18-64',
  'Y_GE18',
  'Y25-49',
  'Y25-54',
  'Y50-64',
  'Y55-64',
  'Y_LT60',
  'Y_GE60',
  'Y_LT65',
  'Y65-74',
  'Y_GE65',
  'Y_LT75',
  'Y_GE75',
]
const SMOKING_AGE_CODES = [
  'Y15-19',
  'Y15-24',
  'Y15-29',
  'Y15-44',
  'Y15-64',
  'Y18-24',
  'Y18-44',
  'Y18-64',
  'Y_GE18',
  'Y20-24',
  'Y25-29',
  'Y25-34',
  'Y25-64',
  'Y35-44',
  'Y45-54',
  'Y45-64',
  'Y55-64',
  'Y65-74',
  'Y_GE65',
  'Y_GE75',
]
const HEALTH_AGE_CODES = [
  'Y15-19',
  'Y15-24',
  'Y15-29',
  'Y15-64',
  'Y18-24',
  'Y18-44',
  'Y18-64',
  'Y_GE18',
  'Y20-24',
  'Y25-29',
  'Y25-34',
  'Y25-64',
  'Y35-44',
  'Y45-54',
  'Y45-64',
  'Y55-64',
  'Y65-74',
  'Y_GE65',
  'Y_GE75',
]
const DEFAULT_GROUP = {
  age: 'Y55-64',
  sex: 'M',
  incomeQuintile: 'QU3',
}

const countryCodes = EU_COUNTRIES.map(([code]) => code)
const countryNames = Object.fromEntries(EU_COUNTRIES)
const countryIsoCodes = {
  EL: 'GR',
}
const sexCodes = SEX_GROUPS.map(({ id }) => id)
const incomeQuintileCodes = INCOME_QUINTILES.map(({ id }) => id)

const CURRENCY_FALLBACKS = {
  BG: { code: 'BGN', name: 'Bulgarian lev', symbol: 'лв' },
  CZ: { code: 'CZK', name: 'Czech koruna', symbol: 'Kč' },
  DK: { code: 'DKK', name: 'Danish krone', symbol: 'kr' },
  HR: { code: 'EUR', name: 'Euro', symbol: '€' },
  HU: { code: 'HUF', name: 'Hungarian forint', symbol: 'Ft' },
  PL: { code: 'PLN', name: 'Polish złoty', symbol: 'zł' },
  RO: { code: 'RON', name: 'Romanian leu', symbol: 'lei' },
  SE: { code: 'SEK', name: 'Swedish krona', symbol: 'kr' },
}
const HISTORICAL_CURRENCIES = {
  HR: {
    2014: { code: 'HRK', name: 'Croatian kuna', symbol: 'kn' },
    2019: { code: 'HRK', name: 'Croatian kuna', symbol: 'kn' },
  },
  LT: {
    2014: { code: 'LTL', name: 'Lithuanian litas', symbol: 'Lt' },
  },
}

const datasetRequests = [
  {
    key: 'income',
    dataset: 'ilc_di03',
    filename: 'ilc_di03.csv',
    params: {
      freq: 'A',
      age: INCOME_AGE_CODES,
      sex: sexCodes,
      unit: ['PPS', 'EUR', 'NAC'],
      indic_il: ['MEI_E', 'MED_E'],
      time: YEARS,
      geo: countryCodes,
    },
  },
  {
    key: 'smoking',
    dataset: 'hlth_ehis_sk3i',
    filename: 'hlth_ehis_sk3i.csv',
    params: {
      freq: 'A',
      age: SMOKING_AGE_CODES,
      sex: sexCodes,
      unit: 'PC',
      smoking: ['SM_LT20D', 'SM_GE20D'],
      quant_inc: incomeQuintileCodes,
      time: YEARS,
      geo: countryCodes,
    },
  },
  {
    key: 'drinking',
    dataset: 'hlth_ehis_al3i',
    filename: 'hlth_ehis_al3i.csv',
    params: {
      freq: 'A',
      age: HEALTH_AGE_CODES,
      sex: sexCodes,
      unit: 'PC',
      frequenc: ['GE1W', 'MTH'],
      quant_inc: incomeQuintileCodes,
      time: YEARS,
      geo: countryCodes,
    },
  },
  {
    key: 'depression',
    dataset: 'hlth_ehis_mh1i',
    filename: 'hlth_ehis_mh1i.csv',
    params: {
      freq: 'A',
      age: HEALTH_AGE_CODES,
      sex: sexCodes,
      unit: 'PC',
      hlth_pb: 'DPR',
      quant_inc: incomeQuintileCodes,
      time: YEARS,
      geo: countryCodes,
    },
  },
]

function buildUrl(dataset, params) {
  const search = new URLSearchParams({ lang: 'en' })

  Object.entries(params).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]
    values.forEach((entry) => search.append(key, entry))
  })

  return `${DATA_API}${dataset}?${search.toString()}`
}

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}: ${url}`)
  }

  return response.json()
}

function getCategoryIndex(cube, dimension, code) {
  const index = cube.dimension?.[dimension]?.category?.index?.[code]
  return typeof index === 'number' ? index : undefined
}

function getValue(cube, selection) {
  const dimensionIds = cube.id
  const sizes = cube.size
  let flatIndex = 0

  for (let i = 0; i < dimensionIds.length; i += 1) {
    const dimension = dimensionIds[i]
    const category = selection[dimension]
    const categoryIndex = getCategoryIndex(cube, dimension, category)

    if (categoryIndex === undefined) {
      return null
    }

    flatIndex = flatIndex * sizes[i] + categoryIndex
  }

  const value = cube.value?.[flatIndex]
  return typeof value === 'number' ? value : null
}

function round(value, precision = 1) {
  if (typeof value !== 'number') {
    return null
  }

  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function getCategoryCodes(cube, dimension) {
  const category = cube.dimension?.[dimension]?.category
  const index = category?.index

  if (!index || typeof index !== 'object' || Array.isArray(index)) {
    return Object.keys(category?.label ?? {})
  }

  return Object.entries(index)
    .sort(([, firstIndex], [, secondIndex]) => firstIndex - secondIndex)
    .map(([code]) => code)
}

function decodeFlatIndex(flatIndex, sizes) {
  const coordinates = new Array(sizes.length)
  let remaining = flatIndex

  for (let index = sizes.length - 1; index >= 0; index -= 1) {
    coordinates[index] = remaining % sizes[index]
    remaining = Math.floor(remaining / sizes[index])
  }

  return coordinates
}

function getObservationEntry(entries, flatIndex) {
  if (Array.isArray(entries)) {
    return entries[flatIndex]
  }

  return entries?.[flatIndex]
}

function escapeCsvValue(value) {
  if (value === undefined || value === null) {
    return ''
  }

  const text = String(value)

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`
  }

  return text
}

function cubeToCsv(dataset, cube) {
  const dimensionIds = cube.id
  const sizes = cube.size
  const categoryCodes = dimensionIds.map((dimension) =>
    getCategoryCodes(cube, dimension),
  )
  const rowCount = sizes.reduce((total, size) => total * size, 1)
  const lines = [['dataset', ...dimensionIds, 'value', 'status']]

  for (let flatIndex = 0; flatIndex < rowCount; flatIndex += 1) {
    const coordinates = decodeFlatIndex(flatIndex, sizes)
    const dimensionValues = coordinates.map(
      (categoryIndex, dimensionIndex) =>
        categoryCodes[dimensionIndex][categoryIndex] ?? '',
    )
    const value = getObservationEntry(cube.value, flatIndex)
    const status = getObservationEntry(cube.status, flatIndex)

    lines.push([dataset, ...dimensionValues, value, status])
  }

  return `${lines
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n')}\n`
}

async function fetchDatasetCubes() {
  return Promise.all(
    datasetRequests.map(async (request) => ({
      ...request,
      cube: await fetchJson(buildUrl(request.dataset, request.params)),
    })),
  )
}

function normalizeCurrencyName(name) {
  return name === 'euro' ? 'Euro' : name
}

async function fetchCurrencyMetadata() {
  const isoCodes = countryCodes.map((code) => countryIsoCodes[code] ?? code)
  const url = `${REST_COUNTRIES_API}?codes=${isoCodes.join(
    ',',
  )}&fields=cca2,currencies`
  const countries = await fetchJson(url)
  const metadata = {}

  countries.forEach((country) => {
    const eurostatCode =
      Object.entries(countryIsoCodes).find(
        ([, isoCode]) => isoCode === country.cca2,
      )?.[0] ?? country.cca2
    const [code, details] = Object.entries(country.currencies ?? {})[0] ?? []

    if (code && details) {
      metadata[eurostatCode] = {
        code,
        name: normalizeCurrencyName(details.name),
        symbol: details.symbol,
      }
    }
  })

  countryCodes.forEach((code) => {
    if (!metadata[code]) {
      metadata[code] = CURRENCY_FALLBACKS[code] ?? {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
      }
    }
  })

  return metadata
}

function getNationalCurrencyMetadata(currencyMetadata, geo, time) {
  return (
    HISTORICAL_CURRENCIES[geo]?.[time] ??
    currencyMetadata[geo] ?? {
      code: 'NAC',
      name: 'National currency',
      symbol: null,
    }
  )
}

function buildGroupKey({ age, sex, incomeQuintile }) {
  return `${age}|${sex}|${incomeQuintile}`
}

function buildCountryYearStats(datasets, currencyMetadata, geo, time, group) {
  const { income, smoking, drinking, depression } = datasets
  const nationalCurrency = getNationalCurrencyMetadata(currencyMetadata, geo, time)
  const meanIncome = getValue(income, {
    freq: 'A',
    age: group.age,
    sex: group.sex,
    unit: 'PPS',
    indic_il: 'MEI_E',
    time,
    geo,
  })
  const medianIncome = getValue(income, {
    freq: 'A',
    age: group.age,
    sex: group.sex,
    unit: 'PPS',
    indic_il: 'MED_E',
    time,
    geo,
  })
  const heavyWeekly = getValue(drinking, {
    freq: 'A',
    age: group.age,
    sex: group.sex,
    unit: 'PC',
    frequenc: 'GE1W',
    quant_inc: group.incomeQuintile,
    time,
    geo,
  })
  const heavyMonthly = getValue(drinking, {
    freq: 'A',
    age: group.age,
    sex: group.sex,
    unit: 'PC',
    frequenc: 'MTH',
    quant_inc: group.incomeQuintile,
    time,
    geo,
  })
  const heavyDrinking =
    heavyWeekly === null || heavyMonthly === null
      ? null
      : round(heavyWeekly + heavyMonthly)

  return {
    meanIncome,
    medianIncome,
    incomeCurrencies: {
      meanIncome: {
        eur: getValue(income, {
          freq: 'A',
          age: group.age,
          sex: group.sex,
          unit: 'EUR',
          indic_il: 'MEI_E',
          time,
          geo,
        }),
        nationalCurrency: getValue(income, {
          freq: 'A',
          age: group.age,
          sex: group.sex,
          unit: 'NAC',
          indic_il: 'MEI_E',
          time,
          geo,
        }),
        nationalCurrencyCode: nationalCurrency.code,
        nationalCurrencyName: nationalCurrency.name,
        nationalCurrencySymbol: nationalCurrency.symbol ?? null,
      },
      medianIncome: {
        eur: getValue(income, {
          freq: 'A',
          age: group.age,
          sex: group.sex,
          unit: 'EUR',
          indic_il: 'MED_E',
          time,
          geo,
        }),
        nationalCurrency: getValue(income, {
          freq: 'A',
          age: group.age,
          sex: group.sex,
          unit: 'NAC',
          indic_il: 'MED_E',
          time,
          geo,
        }),
        nationalCurrencyCode: nationalCurrency.code,
        nationalCurrencyName: nationalCurrency.name,
        nationalCurrencySymbol: nationalCurrency.symbol ?? null,
      },
    },
    smokingLess20: round(
      getValue(smoking, {
        freq: 'A',
        age: group.age,
        sex: group.sex,
        unit: 'PC',
        smoking: 'SM_LT20D',
        quant_inc: group.incomeQuintile,
        time,
        geo,
      }),
    ),
    smoking20Plus: round(
      getValue(smoking, {
        freq: 'A',
        age: group.age,
        sex: group.sex,
        unit: 'PC',
        smoking: 'SM_GE20D',
        quant_inc: group.incomeQuintile,
        time,
        geo,
      }),
    ),
    heavyDrinking,
    mentalHealth: round(
      getValue(depression, {
        freq: 'A',
        age: group.age,
        sex: group.sex,
        unit: 'PC',
        hlth_pb: 'DPR',
        quant_inc: group.incomeQuintile,
        time,
        geo,
      }),
    ),
  }
}

function buildStats(fetchedDatasets, currencyMetadata) {
  const datasetsByKey = Object.fromEntries(
    fetchedDatasets.map((request) => [request.key, request.cube]),
  )
  const defaultGroupKey = buildGroupKey(DEFAULT_GROUP)

  const countries = {}

  EU_COUNTRIES.forEach(([geo, name]) => {
    const groupedStats = {}

    GROUP_AGES.forEach((age) => {
      SEX_GROUPS.forEach((sex) => {
        INCOME_QUINTILES.forEach((incomeQuintile) => {
          const group = {
            age: age.id,
            sex: sex.id,
            incomeQuintile: incomeQuintile.id,
          }
          const groupKey = buildGroupKey(group)

          groupedStats[groupKey] = {}
          YEARS.forEach((time) => {
            groupedStats[groupKey][time] = buildCountryYearStats(
              datasetsByKey,
              currencyMetadata,
              geo,
              time,
              group,
            )
          })
        })
      })
    })

    countries[geo] = {
      name,
      nationalCurrencies: Object.fromEntries(
        YEARS.map((time) => [
          time,
          getNationalCurrencyMetadata(currencyMetadata, geo, time),
        ]),
      ),
      stats: groupedStats[defaultGroupKey],
      groupedStats,
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    coverage: 'Current EU-27 member states',
    years: YEARS,
    groupDimensions: {
      age: GROUP_AGES,
      sex: SEX_GROUPS,
      incomeQuintile: INCOME_QUINTILES,
    },
    defaultGroup: DEFAULT_GROUP,
    currencyMetadata: Object.fromEntries(
      EU_COUNTRIES.map(([geo]) => [geo, currencyMetadata[geo]]),
    ),
    metrics: [
      {
        id: 'meanIncome',
        label: 'Mean net income',
        unit: 'PPS',
        dataset: 'ilc_di03',
      },
      {
        id: 'medianIncome',
        label: 'Median net income',
        unit: 'PPS',
        dataset: 'ilc_di03',
      },
      {
        id: 'smokingLess20',
        label: 'Daily smokers under 20 cigarettes',
        unit: '%',
        dataset: 'hlth_ehis_sk3i',
      },
      {
        id: 'smoking20Plus',
        label: 'Daily smokers 20+ cigarettes',
        unit: '%',
        dataset: 'hlth_ehis_sk3i',
      },
      {
        id: 'heavyDrinking',
        label: 'Heavy episodic drinking at least monthly',
        unit: '%',
        dataset: 'hlth_ehis_al3i',
        calculation: 'GE1W + MTH',
      },
      {
        id: 'mentalHealth',
        label: 'Current depressive symptoms',
        unit: '%',
        dataset: 'hlth_ehis_mh1i',
      },
    ],
    countries,
    notes: [
      'Income values are in purchasing power standards per inhabitant.',
      'Income statistics also include Euro and national-currency values from Eurostat unit EUR and NAC.',
      'Current national-currency names are fetched from REST Countries; Croatia 2014/2019 and Lithuania 2014 use historical currency names for Eurostat NAC values.',
      'Health indicators are percentages of the population covered by the European Health Interview Survey.',
      'Daily smoking is split by reported cigarette consumption: less than 20 cigarettes per day and 20 or more cigarettes per day.',
      'Heavy episodic drinking means more than 60g of pure ethanol on one occasion; the displayed value sums weekly and monthly-but-not-weekly responses.',
      'Fetched observations exclude Eurostat total categories for age, sex, and income quintile.',
      'The income dataset is grouped by age and sex; Eurostat does not expose an income-quintile dimension for mean and median net income in ilc_di03.',
    ],
    sources: [
      {
        label: 'Eurostat Statistics API',
        url: DATA_API,
      },
      {
        label: 'Eurostat GISCO country boundaries',
        url: MAP_URL,
      },
      {
        label: 'REST Countries currency metadata',
        url: REST_COUNTRIES_API,
      },
    ],
    rawData: fetchedDatasets.map(({ dataset, filename, params }) => ({
      dataset,
      path: `/data/raw/${filename}`,
      url: buildUrl(dataset, params),
    })),
  }
}

async function buildRawCsvFiles(fetchedDatasets) {
  await rm(RAW_DATA_DIR, { recursive: true, force: true })
  await mkdir(RAW_DATA_DIR, { recursive: true })
  await Promise.all(
    fetchedDatasets.map(({ dataset, filename, cube }) =>
      writeFile(`${RAW_DATA_DIR}/${filename}`, cubeToCsv(dataset, cube)),
    ),
  )
}

async function buildMap() {
  const topojson = await fetchJson(MAP_URL)
  const objectName = Object.keys(topojson.objects)[0]
  const euCountrySet = new Set(countryCodes)

  topojson.objects[objectName].geometries = topojson.objects[
    objectName
  ].geometries
    .filter((geometry) => euCountrySet.has(geometry.properties?.CNTR_ID))
    .map((geometry) => ({
      ...geometry,
      properties: {
        ...geometry.properties,
        NAME_ENGL:
          countryNames[geometry.properties.CNTR_ID] ||
          geometry.properties.NAME_ENGL,
      },
    }))

  return topojson
}

async function main() {
  await mkdir('src/data', { recursive: true })
  await mkdir('public/data', { recursive: true })

  const [fetchedDatasets, map, currencyMetadata] = await Promise.all([
    fetchDatasetCubes(),
    buildMap(),
    fetchCurrencyMetadata(),
  ])
  const stats = buildStats(fetchedDatasets, currencyMetadata)

  await Promise.all([
    buildRawCsvFiles(fetchedDatasets),
    writeFile('src/data/euStats.json', `${JSON.stringify(stats, null, 2)}\n`),
    writeFile(
      'public/data/eu-countries-2020.topojson.json',
      `${JSON.stringify(map)}\n`,
    ),
  ])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
