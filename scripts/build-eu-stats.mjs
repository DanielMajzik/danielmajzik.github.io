import { mkdir, writeFile } from 'node:fs/promises'

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

const countryCodes = EU_COUNTRIES.map(([code]) => code)
const countryNames = Object.fromEntries(EU_COUNTRIES)

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

async function buildStats() {
  const [income, smoking, drinking, depression] = await Promise.all([
    fetchJson(
      buildUrl('ilc_di03', {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PPS',
        indic_il: ['MEI_E', 'MED_E'],
        time: YEARS,
        geo: countryCodes,
      }),
    ),
    fetchJson(
      buildUrl('hlth_ehis_sk3i', {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PC',
        smoking: ['SM_LT20D', 'SM_GE20D'],
        quant_inc: 'TOTAL',
        time: YEARS,
        geo: countryCodes,
      }),
    ),
    fetchJson(
      buildUrl('hlth_ehis_al3e', {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PC',
        frequenc: ['GE1W', 'MTH'],
        isced11: 'TOTAL',
        time: YEARS,
        geo: countryCodes,
      }),
    ),
    fetchJson(
      buildUrl('hlth_ehis_cd1e', {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PC',
        hlth_pb: 'DPR_CHR',
        isced11: 'TOTAL',
        time: YEARS,
        geo: countryCodes,
      }),
    ),
  ])

  const countries = {}

  EU_COUNTRIES.forEach(([geo, name]) => {
    countries[geo] = {
      name,
      stats: {},
    }

    YEARS.forEach((time) => {
      const heavyWeekly = getValue(drinking, {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PC',
        frequenc: 'GE1W',
        isced11: 'TOTAL',
        time,
        geo,
      })
      const heavyMonthly = getValue(drinking, {
        freq: 'A',
        age: 'TOTAL',
        sex: 'T',
        unit: 'PC',
        frequenc: 'MTH',
        isced11: 'TOTAL',
        time,
        geo,
      })
      const heavyDrinking =
        heavyWeekly === null || heavyMonthly === null
          ? null
          : round(heavyWeekly + heavyMonthly)

      countries[geo].stats[time] = {
        meanIncome: getValue(income, {
          freq: 'A',
          age: 'TOTAL',
          sex: 'T',
          unit: 'PPS',
          indic_il: 'MEI_E',
          time,
          geo,
        }),
        medianIncome: getValue(income, {
          freq: 'A',
          age: 'TOTAL',
          sex: 'T',
          unit: 'PPS',
          indic_il: 'MED_E',
          time,
          geo,
        }),
        smokingLess20: round(
          getValue(smoking, {
            freq: 'A',
            age: 'TOTAL',
            sex: 'T',
            unit: 'PC',
            smoking: 'SM_LT20D',
            quant_inc: 'TOTAL',
            time,
            geo,
          }),
        ),
        smoking20Plus: round(
          getValue(smoking, {
            freq: 'A',
            age: 'TOTAL',
            sex: 'T',
            unit: 'PC',
            smoking: 'SM_GE20D',
            quant_inc: 'TOTAL',
            time,
            geo,
          }),
        ),
        heavyDrinking,
        mentalHealth: round(
          getValue(depression, {
            freq: 'A',
            age: 'TOTAL',
            sex: 'T',
            unit: 'PC',
            hlth_pb: 'DPR_CHR',
            isced11: 'TOTAL',
            time,
            geo,
          }),
        ),
      }
    })
  })

  return {
    generatedAt: new Date().toISOString(),
    coverage: 'Current EU-27 member states',
    years: YEARS,
    metrics: [
      {
        id: 'meanIncome',
        label: 'Mean equivalised net income',
        unit: 'PPS',
        dataset: 'ilc_di03',
      },
      {
        id: 'medianIncome',
        label: 'Median equivalised net income',
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
        dataset: 'hlth_ehis_al3e',
        calculation: 'GE1W + MTH',
      },
      {
        id: 'mentalHealth',
        label: 'Self-reported chronic depression',
        unit: '%',
        dataset: 'hlth_ehis_cd1e',
      },
    ],
    countries,
    notes: [
      'Income values are in purchasing power standards per inhabitant.',
      'Health indicators are percentages of the population covered by the European Health Interview Survey.',
      'Daily smoking is split by reported cigarette consumption: less than 20 cigarettes per day and 20 or more cigarettes per day.',
      'Heavy episodic drinking means more than 60g of pure ethanol on one occasion; the displayed value sums weekly and monthly-but-not-weekly responses.',
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
    ],
  }
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

  const [stats, map] = await Promise.all([buildStats(), buildMap()])

  await writeFile('src/data/euStats.json', `${JSON.stringify(stats, null, 2)}\n`)
  await writeFile(
    'public/data/eu-countries-2020.topojson.json',
    `${JSON.stringify(map)}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
