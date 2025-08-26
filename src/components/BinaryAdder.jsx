import React, { useState, useEffect } from 'react'

const BinaryAdder = () => {
  const [bitWidth, setBitWidth] = useState('4')
  const [valueA, setValueA] = useState('5')
  const [valueB, setValueB] = useState('3')
  const [stepByStep, setStepByStep] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
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
  useEffect(() => {
    setBinaryA(toBinary(parseInt(valueA) || 0, bitWidth))
    setBinaryB(toBinary(parseInt(valueB) || 0, bitWidth))
  }, [valueA, valueB, bitWidth])

  const performAddition = (a, b, width) => {
    const numA = parseInt(a) || 0
    const numB = parseInt(b) || 0
    const sum = numA + numB
    const maxValue = Math.pow(2, parseInt(width)) - 1
    
    const binaryA = toBinary(numA, width)
    const binaryB = toBinary(numB, width)
    const binarySum = toBinary(sum, width)
    
    // Calcular acarreos bit por bit y pasos
    const carries = ['']
    const steps = []
    let carry = 0
    
    for (let i = parseInt(width) - 1; i >= 0; i--) {
      const bitA = parseInt(binaryA[i])
      const bitB = parseInt(binaryB[i])
      const localSum = bitA + bitB + carry
      const resultBit = localSum % 2
      const newCarry = localSum > 1 ? 1 : 0
      
      steps.push({
        position: i,
        bitA,
        bitB,
        carryIn: carry,
        localSum,
        resultBit,
        carryOut: newCarry,
        operation: `${bitA} + ${bitB} + ${carry} = ${localSum} = ${resultBit} (carry: ${newCarry})`
      })
      
      carry = newCarry
      carries.unshift(carry.toString())
    }
    
    return {
      sum: sum > maxValue ? sum - Math.pow(2, parseInt(width)) : sum,
      overflow: sum > maxValue,
      binaryA,
      binaryB,
      binarySum,
      carries,
      finalCarry: carry,
      steps: steps.reverse()
    }
  }

  // Efectos para animación paso a paso
  useEffect(() => {
    if (stepByStep && isAnimating) {
      const result = performAddition(valueA, valueB, bitWidth)
      const totalSteps = result.steps.length + 1
      
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps) {
            setIsAnimating(false)
            return 0
          }
          return prev + 1
        })
      }, 1500)
      
      return () => clearInterval(timer)
    }
  }, [stepByStep, isAnimating, valueA, valueB, bitWidth])

  const startStepByStep = () => {
    setCurrentStep(0)
    setIsAnimating(true)
  }

  const stopStepByStep = () => {
    setIsAnimating(false)
    setCurrentStep(0)
  }

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

  const InteractiveBitDisplay = ({ binary, label, isA = true, highlighted = false }) => {
    return (
      <div style={{ margin: '10px 0' }}>
        <div style={{ fontWeight: '600', marginBottom: '5px', color: highlighted ? '#e74c3c' : '#2c3e50' }}>
          {label}: {isA ? valueA : valueB} (decimal)
        </div>
        <div className="binary-display" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {binary.split('').map((bit, index) => (
            <span 
              key={index} 
              className={`bit ${bit === '1' ? 'active' : ''}`}
              onClick={interactiveMode ? () => toggleBit(isA ? valueA : valueB, index, isA) : undefined}
              style={{
                backgroundColor: highlighted ? (bit === '1' ? '#e74c3c' : '#fadbd8') : undefined,
                borderColor: highlighted ? '#e74c3c' : undefined,
                cursor: interactiveMode ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                transform: interactiveMode ? 'scale(1.1)' : 'scale(1)',
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

  const AdderVisualization = () => {
    const result = performAddition(valueA, valueB, bitWidth)
    
    return (
      <div className="adder-display">
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#ecf0f1' }}>
          <h3>Sumador Binario de {bitWidth} bits</h3>
          <p>A = {valueA}, B = {valueB}</p>
        </div>
        
        {/* Acarreos */}
        <div className="adder-row">
          <span style={{ marginRight: '20px', width: '100px', display: 'inline-block' }}>Acarreos:</span>
          {result.carries.map((carry, index) => (
            <span 
              key={index} 
              className={carry === '1' ? 'carry-bit' : ''}
              style={{ 
                marginRight: '10px', 
                fontSize: '0.9rem',
                color: carry === '1' ? '#e74c3c' : '#7f8c8d',
                backgroundColor: stepByStep && currentStep >= index ? 'rgba(231, 76, 60, 0.2)' : 'transparent',
                padding: '2px 4px',
                borderRadius: '3px',
                transition: 'all 0.3s ease'
              }}
            >
              {carry || ' '}
            </span>
          ))}
        </div>
        
        {/* Mostrar valores interactivos o normales */}
        {interactiveMode ? (
          <>
            <InteractiveBitDisplay 
              binary={binaryA} 
              label="A" 
              isA={true}
              highlighted={stepByStep && currentStep > 0}
            />
            <InteractiveBitDisplay 
              binary={binaryB} 
              label="B" 
              isA={false}
              highlighted={stepByStep && currentStep > 0}
            />
          </>
        ) : (
          <>
            {/* Valor A */}
            <div className="adder-row">
              <span style={{ marginRight: '20px', width: '100px', display: 'inline-block' }}>A:</span>
              {result.binaryA.split('').map((bit, index) => (
                <span 
                  key={index} 
                  style={{ 
                    marginRight: '10px',
                    backgroundColor: stepByStep && currentStep > 0 && currentStep - 1 === (parseInt(bitWidth) - 1 - index) ? 'rgba(52, 152, 219, 0.3)' : 'transparent',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {bit}
                </span>
              ))}
              <span style={{ marginLeft: '20px', color: '#7f8c8d' }}>({valueA})</span>
            </div>
            
            {/* Valor B */}
            <div className="adder-row">
              <span style={{ marginRight: '20px', width: '100px', display: 'inline-block' }}>B:</span>
              {result.binaryB.split('').map((bit, index) => (
                <span 
                  key={index} 
                  style={{ 
                    marginRight: '10px',
                    backgroundColor: stepByStep && currentStep > 0 && currentStep - 1 === (parseInt(bitWidth) - 1 - index) ? 'rgba(52, 152, 219, 0.3)' : 'transparent',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {bit}
                </span>
              ))}
              <span style={{ marginLeft: '20px', color: '#7f8c8d' }}>({valueB})</span>
            </div>
          </>
        )}
        
        {/* Línea de suma */}
        <div className="adder-row sum-line">
          <span style={{ marginRight: '20px', width: '100px', display: 'inline-block' }}>Suma:</span>
          {result.binarySum.split('').map((bit, index) => (
            <span 
              key={index} 
              style={{ 
                marginRight: '10px', 
                fontWeight: 'bold',
                backgroundColor: stepByStep && currentStep > 0 && currentStep - 1 >= (parseInt(bitWidth) - 1 - index) ? 'rgba(46, 204, 113, 0.3)' : 'transparent',
                padding: '2px 4px',
                borderRadius: '3px',
                transition: 'all 0.3s ease'
              }}
            >
              {bit}
            </span>
          ))}
          <span style={{ marginLeft: '20px', color: '#2ecc71' }}>
            ({result.sum}) {result.overflow && <span className="carry-bit">[OVERFLOW]</span>}
          </span>
        </div>
        
        {result.finalCarry === 1 && (
          <div style={{ marginTop: '15px', color: '#e74c3c', textAlign: 'center' }}>
            <strong>Acarreo final: {result.finalCarry}</strong>
            {result.overflow && <div>¡Desbordamiento detectado!</div>}
          </div>
        )}
        
        {/* Paso actual */}
        {stepByStep && currentStep > 0 && currentStep <= result.steps.length && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(52, 152, 219, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(52, 152, 219, 0.3)'
          }}>
            <h4 style={{ color: '#3498db', marginBottom: '10px' }}>
              Paso {currentStep}: Posición {parseInt(bitWidth) - currentStep} (bit {currentStep - 1})
            </h4>
            <p style={{ color: '#ecf0f1' }}>
              {result.steps[currentStep - 1]?.operation}
            </p>
          </div>
        )}
      </div>
    )
  }

  const FullAdderDiagram = () => {
    return (
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        margin: '20px 0' 
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Sumador Completo (Full Adder)</h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #dee2e6'
          }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Entradas</div>
            <div>A (bit), B (bit), Cin (acarreo entrada)</div>
          </div>
          
          <div style={{ fontSize: '2rem', color: '#667eea' }}>↓</div>
          
          <div style={{ 
            background: '#667eea', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            SUMADOR COMPLETO
            <div style={{ fontSize: '0.8rem', marginTop: '5px', opacity: '0.9' }}>
              Suma = A ⊕ B ⊕ Cin<br/>
              Cout = (A ∧ B) ∨ (Cin ∧ (A ⊕ B))
            </div>
          </div>
          
          <div style={{ fontSize: '2rem', color: '#667eea' }}>↓</div>
          
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #dee2e6'
          }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Salidas</div>
            <div>Suma (bit), Cout (acarreo salida)</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="section">
      <h2 className="section-title">Sumador Binario</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>Número de bits:</label>
          <select 
            value={bitWidth} 
            onChange={(e) => setBitWidth(e.target.value)}
          >
            <option value="1">1 bit</option>
            <option value="2">2 bits</option>
            <option value="4">4 bits</option>
            <option value="8">8 bits</option>
            <option value="16">16 bits</option>
          </select>
        </div>
        
        {!interactiveMode && (
          <>
            <div className="control-group">
              <label>Valor A:</label>
              <input 
                type="number" 
                value={valueA}
                onChange={(e) => setValueA(e.target.value)}
                min="0"
                max={Math.pow(2, parseInt(bitWidth)) - 1}
              />
            </div>
            
            <div className="control-group">
              <label>Valor B:</label>
              <input 
                type="number" 
                value={valueB}
                onChange={(e) => setValueB(e.target.value)}
                min="0"
                max={Math.pow(2, parseInt(bitWidth)) - 1}
              />
            </div>
          </>
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
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={stepByStep}
              onChange={(e) => setStepByStep(e.target.checked)}
            />
            Simulación Paso a Paso
          </label>
        </div>
        
        {stepByStep && (
          <div className="control-group">
            <button 
              onClick={startStepByStep}
              disabled={isAnimating}
              style={{
                padding: '8px 16px',
                backgroundColor: isAnimating ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              {isAnimating ? 'Ejecutando...' : 'Iniciar Simulación'}
            </button>
            <button 
              onClick={stopStepByStep}
              disabled={!isAnimating}
              style={{
                padding: '8px 16px',
                backgroundColor: !isAnimating ? '#95a5a6' : '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !isAnimating ? 'not-allowed' : 'pointer'
              }}
            >
              Detener
            </button>
          </div>
        )}
        
        {interactiveMode && (
          <div className="control-group">
            <button 
              onClick={() => {
                setValueA('5')
                setValueB('3')
                setBinaryA(toBinary(5, bitWidth))
                setBinaryB(toBinary(3, bitWidth))
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Resetear Valores
            </button>
          </div>
        )}
      </div>

      <div className="display-area">
        <AdderVisualization />
      </div>

      <FullAdderDiagram />

      <div className="display-area">
        <div className="result-display">
          <h3>Información sobre Sumadores Binarios</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4>Medio Sumador (Half Adder)</h4>
              <p><strong>Entradas:</strong> A, B (2 bits)</p>
              <p><strong>Salidas:</strong> Suma, Acarreo</p>
              <p><strong>Función Suma:</strong> A ⊕ B</p>
              <p><strong>Función Acarreo:</strong> A ∧ B</p>
              <p>No puede manejar acarreo de entrada</p>
            </div>
            
            <div>
              <h4>Sumador Completo (Full Adder)</h4>
              <p><strong>Entradas:</strong> A, B, Cin (3 bits)</p>
              <p><strong>Salidas:</strong> Suma, Cout</p>
              <p><strong>Función Suma:</strong> A ⊕ B ⊕ Cin</p>
              <p><strong>Función Acarreo:</strong> (A ∧ B) ∨ (Cin ∧ (A ⊕ B))</p>
              <p>Puede manejar acarreo de entrada</p>
            </div>
            
            <div>
              <h4>Sumador de Propagación</h4>
              <p>Conecta múltiples sumadores completos</p>
              <p>El acarreo se propaga de bit menos significativo al más significativo</p>
              <p>Retraso proporcional al número de bits</p>
              <p>Usado en procesadores para suma de enteros</p>
            </div>
            
            <div>
              <h4>Modo Interactivo</h4>
              <p>Activa el modo interactivo para cambiar bits individualmente</p>
              <p>Click en cualquier bit para alternar entre 0 y 1</p>
              <p>Observa cómo cambia el resultado inmediatamente</p>
              <p>Ideal para experimentar y aprender</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BinaryAdder
