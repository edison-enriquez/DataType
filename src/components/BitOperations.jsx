import React, { useState } from 'react'

const BitOperations = () => {
  const [valueA, setValueA] = useState('12')
  const [valueB, setValueB] = useState('10')
  const [bitWidth, setBitWidth] = useState('8')
  const [interactiveMode, setInteractiveMode] = useState(false)
  const [binaryA, setBinaryA] = useState('')
  const [binaryB, setBinaryB] = useState('')

  const toBinary = (num, width) => {
    return (num >>> 0).toString(2).padStart(parseInt(width), '0').slice(-parseInt(width))
  }

  const fromBinary = (binary) => {
    return parseInt(binary, 2)
  }

  // Actualizar binarios cuando cambien los valores
  React.useEffect(() => {
    setBinaryA(toBinary(parseInt(valueA) || 0, bitWidth))
    setBinaryB(toBinary(parseInt(valueB) || 0, bitWidth))
  }, [valueA, valueB, bitWidth])

  // Función para cambiar bit individual
  const toggleBit = (value, position, isA = true) => {
    const binary = isA ? binaryA : binaryB
    const newBinary = binary.split('')
    newBinary[position] = newBinary[position] === '0' ? '1' : '0'
    const newBinaryString = newBinary.join('')
    const newDecimal = fromBinary(newBinaryString)
    
    if (isA) {
      setBinaryA(newBinaryString)
      setValueA(newDecimal.toString())
    } else {
      setBinaryB(newBinaryString)
      setValueB(newDecimal.toString())
    }
  }

  const performOperation = (a, b, operation) => {
    const numA = parseInt(a) || 0
    const numB = parseInt(b) || 0
    
    switch(operation) {
      case 'AND': return numA & numB
      case 'OR': return numA | numB
      case 'XOR': return numA ^ numB
      case 'NOT_A': return ~numA & ((1 << parseInt(bitWidth)) - 1)
      case 'LEFT_SHIFT': return (numA << 1) & ((1 << parseInt(bitWidth)) - 1)
      case 'RIGHT_SHIFT': return numA >>> 1
      default: return 0
    }
  }

  const BinaryVisualization = ({ value, label, highlight = false, isA = true }) => {
    const binary = interactiveMode ? (isA ? binaryA : binaryB) : toBinary(parseInt(value) || 0, bitWidth)
    
    return (
      <div style={{ margin: '10px 0' }}>
        <div style={{ fontWeight: '600', marginBottom: '5px', color: highlight ? '#e74c3c' : '#2c3e50' }}>
          {label}: {value} (decimal)
        </div>
        <div className="binary-display" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {binary.split('').map((bit, index) => (
            <span 
              key={index} 
              className={`bit ${bit === '1' ? 'active' : ''}`}
              onClick={interactiveMode ? () => toggleBit(value, index, isA) : undefined}
              style={{
                backgroundColor: highlight ? (bit === '1' ? '#e74c3c' : '#fadbd8') : undefined,
                borderColor: highlight ? '#e74c3c' : undefined,
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
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
            Click en cualquier bit para cambiarlo
          </div>
        )}
      </div>
    )
  }

  const operations = [
    { key: 'AND', symbol: '&', name: 'AND', description: 'Resultado es 1 solo si ambos bits son 1' },
    { key: 'OR', symbol: '|', name: 'OR', description: 'Resultado es 1 si al menos uno de los bits es 1' },
    { key: 'XOR', symbol: '^', name: 'XOR', description: 'Resultado es 1 si los bits son diferentes' },
    { key: 'NOT_A', symbol: '~', name: 'NOT', description: 'Invierte todos los bits' },
    { key: 'LEFT_SHIFT', symbol: '<<', name: 'Desplazamiento Izquierda', description: 'Mueve bits hacia la izquierda' },
    { key: 'RIGHT_SHIFT', symbol: '>>', name: 'Desplazamiento Derecha', description: 'Mueve bits hacia la derecha' }
  ]

  return (
    <section className="section">
      <h2 className="section-title">Operaciones Bit a Bit</h2>
      
      <div className="controls">
        {!interactiveMode && (
          <>
            <div className="control-group">
              <label>Valor A:</label>
              <input 
                type="number" 
                value={valueA}
                onChange={(e) => setValueA(e.target.value)}
                min="0"
              />
            </div>
            
            <div className="control-group">
              <label>Valor B:</label>
              <input 
                type="number" 
                value={valueB}
                onChange={(e) => setValueB(e.target.value)}
                min="0"
              />
            </div>
          </>
        )}
        
        <div className="control-group">
          <label>Ancho de bits:</label>
          <select 
            value={bitWidth} 
            onChange={(e) => setBitWidth(e.target.value)}
          >
            <option value="4">4 bits</option>
            <option value="8">8 bits</option>
            <option value="16">16 bits</option>
          </select>
        </div>
        
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
        <h3>Valores de entrada</h3>
        <BinaryVisualization value={valueA} label="Valor A" isA={true} />
        <BinaryVisualization value={valueB} label="Valor B" isA={false} />
      </div>

      <div className="operation-demo">
        {operations.map(op => {
          const result = performOperation(valueA, valueB, op.key)
          
          return (
            <div key={op.key} className="operation-card">
              <div className="operation-title">
                {op.name} ({op.symbol})
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                {op.description}
              </div>
              
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                {op.key === 'NOT_A' ? (
                  <div>
                    <div>A: {toBinary(parseInt(valueA) || 0, bitWidth)}</div>
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px' }}>
                      ~A: {toBinary(result, bitWidth)}
                    </div>
                  </div>
                ) : op.key === 'LEFT_SHIFT' ? (
                  <div>
                    <div>A: {toBinary(parseInt(valueA) || 0, bitWidth)}</div>
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px' }}>
                      A&lt;&lt;1: {toBinary(result, bitWidth)}
                    </div>
                  </div>
                ) : op.key === 'RIGHT_SHIFT' ? (
                  <div>
                    <div>A: {toBinary(parseInt(valueA) || 0, bitWidth)}</div>
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px' }}>
                      A&gt;&gt;1: {toBinary(result, bitWidth)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>A: {toBinary(parseInt(valueA) || 0, bitWidth)}</div>
                    <div>B: {toBinary(parseInt(valueB) || 0, bitWidth)}</div>
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', marginTop: '5px' }}>
                      A{op.symbol}B: {toBinary(result, bitWidth)}
                    </div>
                  </div>
                )}
                
                <div style={{ 
                  marginTop: '10px', 
                  padding: '8px', 
                  background: '#f8f9fa', 
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Resultado: {result}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="display-area">
        <div className="result-display">
          <h3>Tabla de Verdad para Operaciones Básicas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4>AND (&)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>B</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A&B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4>OR (|)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>B</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A|B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4>XOR (^)</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>B</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>A^B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td></tr>
                  <tr><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td><td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BitOperations
