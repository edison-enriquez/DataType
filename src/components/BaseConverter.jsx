import React, { useState } from 'react'

const BaseConverter = () => {
  const [inputValue, setInputValue] = useState('42')
  const [inputBase, setInputBase] = useState('10')

  const convertToBase = (value, fromBase, toBase) => {
    try {
      const decimal = parseInt(value, parseInt(fromBase))
      if (isNaN(decimal)) return 'Error'
      return decimal.toString(parseInt(toBase))
    } catch {
      return 'Error'
    }
  }

  const getBaseDisplay = (value, base) => {
    const decimal = parseInt(inputValue, parseInt(inputBase))
    if (isNaN(decimal)) return 'Error'
    
    const converted = decimal.toString(parseInt(base))
    return converted.toUpperCase()
  }

  const bases = [
    { value: '2', name: 'Binario', prefix: '0b' },
    { value: '8', name: 'Octal', prefix: '0o' },
    { value: '10', name: 'Decimal', prefix: '' },
    { value: '16', name: 'Hexadecimal', prefix: '0x' }
  ]

  return (
    <section className="section">
      <h2 className="section-title">Conversor de Bases Numéricas</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>Valor de entrada:</label>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ingresa un número"
          />
        </div>
        
        <div className="control-group">
          <label>Base de entrada:</label>
          <select 
            value={inputBase} 
            onChange={(e) => setInputBase(e.target.value)}
          >
            {bases.map(base => (
              <option key={base.value} value={base.value}>
                {base.name} (Base {base.value})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="base-converter">
        {bases.map(base => (
          <div key={base.value} className="base-display">
            <div className="base-label">{base.name} (Base {base.value})</div>
            <div className="base-value">
              {base.prefix}{getBaseDisplay(inputValue, base.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="display-area" style={{ marginTop: '20px' }}>
        <div className="result-display">
          <h3>Información sobre Bases Numéricas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div>
              <h4>Base 2 (Binario)</h4>
              <p>Usa dígitos: 0, 1</p>
              <p>Usado en computadoras</p>
              <p>Cada posición = potencia de 2</p>
            </div>
            <div>
              <h4>Base 8 (Octal)</h4>
              <p>Usa dígitos: 0-7</p>
              <p>Cada dígito = 3 bits</p>
              <p>Cada posición = potencia de 8</p>
            </div>
            <div>
              <h4>Base 10 (Decimal)</h4>
              <p>Usa dígitos: 0-9</p>
              <p>Sistema común</p>
              <p>Cada posición = potencia de 10</p>
            </div>
            <div>
              <h4>Base 16 (Hexadecimal)</h4>
              <p>Usa: 0-9, A-F</p>
              <p>Cada dígito = 4 bits</p>
              <p>Cada posición = potencia de 16</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BaseConverter
