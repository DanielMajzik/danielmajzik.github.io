import { useState } from 'react'

type DropdownOption<T extends string> = {
  value: T
  label: string
}

type DropdownProps<T extends string> = {
  id: string
  label: string
  options: DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function Dropdown<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

  function chooseOption(nextValue: T) {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div
      className="dropdown-field"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
    >
      <span className="control-label" id={`${id}-label`}>
        {label}
      </span>
      <div className={`dropdown-shell ${isOpen ? 'open' : ''}`}>
        <button
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label ${id}-button`}
          className="dropdown-trigger"
          id={`${id}-button`}
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsOpen(false)
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              setIsOpen(true)
            }
          }}
          type="button"
        >
          <span>{selectedOption.label}</span>
        </button>

        {isOpen ? (
          <div
            aria-labelledby={`${id}-label`}
            className="dropdown-list"
            role="listbox"
          >
            {options.map((option) => (
              <button
                aria-selected={option.value === value}
                className={option.value === value ? 'selected' : ''}
                key={option.value}
                onClick={() => chooseOption(option.value)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
