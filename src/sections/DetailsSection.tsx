import {
  COUNTRIES,
  GROUP_DIMENSIONS,
  METRICS,
  type CountryCode,
  type CountryRecord,
  type GroupSelection,
  type MetricDefinition,
  type MetricId,
  type Year,
  formatChange,
  formatValue,
  formatWholeNumber,
  getChange,
  getCountryStats,
  getNotes,
  isIncomeMetric,
  renderStatValue,
} from '../appData'
import { Dropdown } from './Dropdown'

type DetailsSectionProps = {
  activeCountryCode: CountryCode | null
  activeCountry: CountryRecord | null
  selectedYear: Year
  selectedMetric: MetricId
  selectedGroup: GroupSelection
  activeMetric: MetricDefinition
  onAgeChange: (age: string) => void
  onSexChange: (sex: string) => void
  onIncomeQuintileChange: (incomeQuintile: string) => void
}

export function DetailsSection({
  activeCountryCode,
  activeCountry,
  selectedYear,
  selectedMetric,
  selectedGroup,
  activeMetric,
  onAgeChange,
  onSexChange,
  onIncomeQuintileChange,
}: DetailsSectionProps) {
  const activeCountryStats = activeCountry
    ? getCountryStats(activeCountry, selectedYear, selectedGroup)
    : null
  const activeIncomeCurrencies = isIncomeMetric(selectedMetric)
    ? activeCountryStats?.incomeCurrencies?.[selectedMetric]
    : null

  return (
    <aside className="details-panel" aria-live="polite">
      <div className="details-heading">
        <span>{activeCountryCode ?? 'EU'}</span>
        <h2>{activeCountry?.name ?? 'Country details'}</h2>
      </div>

      {activeCountry && activeCountryStats ? (
        <>
          <div className="group-control-grid" aria-label="Country statistics grouping">
            <Dropdown
              id="age-group-select"
              label="Age"
              onChange={onAgeChange}
              options={GROUP_DIMENSIONS.age.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              value={selectedGroup.age}
            />

            <Dropdown
              id="sex-group-select"
              label="Sex"
              onChange={onSexChange}
              options={GROUP_DIMENSIONS.sex.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              value={selectedGroup.sex}
            />

            <Dropdown
              id="income-quintile-select"
              label="Income quintile"
              onChange={onIncomeQuintileChange}
              options={GROUP_DIMENSIONS.incomeQuintile.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              value={selectedGroup.incomeQuintile}
            />
          </div>

          <div className="selected-stat">
            <span>{selectedYear}</span>
            <strong>{formatValue(activeCountryStats[selectedMetric], activeMetric)}</strong>
            {isIncomeMetric(selectedMetric) ? (
              <div className="selected-stat-currencies">
                <small>
                  EUR{' '}
                  {formatWholeNumber(
                    activeCountryStats.incomeCurrencies?.[selectedMetric]?.eur ??
                      null,
                  )}
                </small>
                {activeIncomeCurrencies?.nationalCurrencyCode &&
                activeIncomeCurrencies.nationalCurrencyCode !== 'EUR' ? (
                  <small>
                    {activeIncomeCurrencies.nationalCurrencyCode}{' '}
                    {formatWholeNumber(
                      activeIncomeCurrencies.nationalCurrency ?? null,
                    )}
                  </small>
                ) : null}
              </div>
            ) : null}
            <small>{activeMetric.label}</small>
          </div>

          <div className="stats-table" role="table" aria-label="Country statistics">
            <div className="stats-row stats-header" role="row">
              <span role="columnheader">Metric</span>
              <span role="columnheader">2014</span>
              <span role="columnheader">2019</span>
              <span role="columnheader">Change</span>
            </div>
            {METRICS.map((metric) => {
              const change = getChange(activeCountry, metric.id, selectedGroup)

              return (
                <div className="stats-row" key={metric.id} role="row">
                  <span role="cell">{metric.label}</span>
                  <span role="cell">
                    {renderStatValue(
                      getCountryStats(activeCountry, '2014', selectedGroup),
                      metric,
                    )}
                  </span>
                  <span role="cell">
                    {renderStatValue(
                      getCountryStats(activeCountry, '2019', selectedGroup),
                      metric,
                    )}
                  </span>
                  <span
                    className={
                      typeof change === 'number' && change > 0
                        ? 'change-positive'
                        : typeof change === 'number' && change < 0
                          ? 'change-negative'
                          : ''
                    }
                    role="cell"
                  >
                    {formatChange(change, metric)}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty-panel">
          <strong>{Object.keys(COUNTRIES).length}</strong>
          <span>countries available</span>
        </div>
      )}

      <div className="notes">
        {getNotes().map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </aside>
  )
}
