import React, { useState } from 'react'

const DataTypeExplorer = () => {
  const [selectedType, setSelectedType] = useState('int')
  const [inputValue, setInputValue] = useState('42')
  const [interactiveMode, setInteractiveMode] = useState(false)
  const [binaryValue, setBinaryValue] = useState('')

  const dataTypes = {
    int: { size: 32, signed: true, description: 'Entero de 32 bits con signo' },
    uint: { size: 32, signed: false, description: 'Entero de 32 bits sin signo' },
    short: { size: 16, signed: true, description: 'Entero de 16 bits con signo' },
    ushort: { size: 16, signed: false, description: 'Entero de 16 bits sin signo' },
    byte: { size: 8, signed: false, description: 'Entero de 8 bits sin signo' },
    sbyte: { size: 8, signed: true, description: 'Entero de 8 bits con signo' },
    long: { size: 64, signed: true, description: 'Entero de 64 bits con signo' },
    float: { size: 32, signed: true, description: 'Punto flotante de 32 bits' },
    double: { size: 64, signed: true, description: 'Punto flotante de 64 bits' }
  }

  const getBinaryRepresentation = (value, type) => {
    const typeInfo = dataTypes[type]
    let num = parseInt(value) || 0
    
    // Manejar overflow/underflow
    const maxValue = typeInfo.signed ? Math.pow(2, typeInfo.size - 1) - 1 : Math.pow(2, typeInfo.size) - 1
    const minValue = typeInfo.signed ? -Math.pow(2, typeInfo.size - 1) : 0
    
    if (num > maxValue) num = maxValue
    if (num < minValue) num = minValue
    
    // Convertir a binario
    let binary
    if (num >= 0) {
      binary = num.toString(2).padStart(typeInfo.size, '0')
    } else {
      // Complemento a 2 para números negativos
      binary = (Math.pow(2, typeInfo.size) + num).toString(2)
    }
    
    return binary
  }

  // Actualizar binario cuando cambie el valor
  React.useEffect(() => {
    setBinaryValue(getBinaryRepresentation(inputValue, selectedType))
  }, [inputValue, selectedType])

  // Función para cambiar bit individual
  const toggleBit = (position) => {
    const newBinary = binaryValue.split('')
    newBinary[position] = newBinary[position] === '0' ? '1' : '0'
    const newBinaryString = newBinary.join('')
    
    const typeInfo = dataTypes[selectedType]
    let newDecimal
    
    if (typeInfo.signed && newBinaryString[0] === '1') {
      // Número negativo en complemento a 2
      newDecimal = parseInt(newBinaryString, 2) - Math.pow(2, typeInfo.size)
    } else {
      newDecimal = parseInt(newBinaryString, 2)
    }
    
    setBinaryValue(newBinaryString)
    setInputValue(newDecimal.toString())
  }

  const getMemoryLayout = (binary) => {
    const bytes = []
    for (let i = 0; i < binary.length; i += 8) {
      bytes.push(binary.slice(i, i + 8))
    }
    return bytes
  }

  const currentType = dataTypes[selectedType]
  const binary = getBinaryRepresentation(inputValue, selectedType)
  const memoryLayout = getMemoryLayout(binary)

  return (
    <section className="section">
      <h2 className="section-title">Explorador de Tipos de Datos</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>Tipo de Dato:</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {Object.entries(dataTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {key} ({type.size} bits)
              </option>
            ))}
          </select>
        </div>
        
        {!interactiveMode && (
          <div className="control-group">
            <label>Valor:</label>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ingresa un número"
            />
          </div>
        )}
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={interactiveMode}
              onChange={(e) => setInteractiveMode(e.target.checked)}
            />
            Modo Interactivo (Click en bits)
          </label>
        </div>
      </div>

      <div className="display-area">
        <div className="result-display">
          <h3>Información del Tipo</h3>
          <p><strong>Descripción:</strong> {currentType.description}</p>
          <p><strong>Tamaño:</strong> {currentType.size} bits ({currentType.size / 8} bytes)</p>
          <p><strong>Signo:</strong> {currentType.signed ? 'Con signo' : 'Sin signo'}</p>
          <p><strong>Rango:</strong> {
            currentType.signed 
              ? `${-Math.pow(2, currentType.size - 1)} a ${Math.pow(2, currentType.size - 1) - 1}`
              : `0 a ${Math.pow(2, currentType.size) - 1}`
          }</p>
          {interactiveMode && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              background: 'rgba(52, 152, 219, 0.1)', 
              borderRadius: '6px',
              border: '1px solid rgba(52, 152, 219, 0.3)'
            }}>
              <strong>💡 Modo Interactivo Activo:</strong>
              <br />Click en cualquier bit de la representación binaria para cambiarlo entre 0 y 1.
              <br />Observa cómo cambia el valor decimal automáticamente.
            </div>
          )}
        </div>

        <div className="result-display">
          <h3>Representación Binaria</h3>
          <div className="binary-display" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {(interactiveMode ? binaryValue : binary).split('').map((bit, index) => (
              <span 
                key={index} 
                className={`bit ${bit === '1' ? 'active' : ''}`}
                onClick={interactiveMode ? () => toggleBit(index) : undefined}
                style={{
                  cursor: interactiveMode ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  transform: interactiveMode ? 'scale(1.05)' : 'scale(1)',
                  userSelect: 'none'
                }}
                title={interactiveMode ? `Bit ${index}: Click para cambiar` : `Bit ${index}`}
              >
                {bit}
              </span>
            ))}
          </div>
          {interactiveMode && (
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
              Click en cualquier bit para cambiarlo. Valor actual: {inputValue}
            </div>
          )}
        </div>

        <div className="result-display">
          <h3>Layout en Memoria</h3>
          <div className="memory-layout">
            {memoryLayout.map((byte, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <strong>Byte {index}:</strong>
                <div className="binary-display" style={{ marginTop: '5px' }}>
                  {byte.split('').map((bit, bitIndex) => (
                    <span key={bitIndex} className={`bit ${bit === '1' ? 'active' : ''}`}>
                      {bit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DataTypeExplorer
