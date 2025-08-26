import React, { useState, useEffect } from 'react'

const SevenSegmentDisplay = () => {
  const [displayValue, setDisplayValue] = useState('8')
  const [base, setBase] = useState('16')
  const [animate, setAnimate] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  
  // Estados para el contador/reloj - siempre activo
  const [counterValue, setCounterValue] = useState(0)
  const [maxValue, setMaxValue] = useState(15)
  const [isCounterRunning, setIsCounterRunning] = useState(false)
  const [counterSpeed, setCounterSpeed] = useState(1000)

  // Mapeo de dígitos a segmentos (a, b, c, d, e, f, g)
  const segmentMaps = {
    hex: {
      '0': [1, 1, 1, 1, 1, 1, 0],
      '1': [0, 1, 1, 0, 0, 0, 0],
      '2': [1, 1, 0, 1, 1, 0, 1],
      '3': [1, 1, 1, 1, 0, 0, 1],
      '4': [0, 1, 1, 0, 0, 1, 1],
      '5': [1, 0, 1, 1, 0, 1, 1],
      '6': [1, 0, 1, 1, 1, 1, 1],
      '7': [1, 1, 1, 0, 0, 0, 0],
      '8': [1, 1, 1, 1, 1, 1, 1],
      '9': [1, 1, 1, 1, 0, 1, 1],
      'A': [1, 1, 1, 0, 1, 1, 1],
      'B': [0, 0, 1, 1, 1, 1, 1],
      'C': [1, 0, 0, 1, 1, 1, 0],
      'D': [0, 1, 1, 1, 1, 0, 1],
      'E': [1, 0, 0, 1, 1, 1, 1],
      'F': [1, 0, 0, 0, 1, 1, 1]
    }
  }

  const getValidChars = (base) => {
    switch(base) {
      case '2': return '01'
      case '8': return '01234567'
      case '10': return '0123456789'
      case '16': return '0123456789ABCDEF'
      default: return '0123456789ABCDEF'
    }
  }

  const isValidDigit = (char, base) => {
    return getValidChars(base).includes(char.toUpperCase())
  }

  const SevenSegment = ({ digit, animate, delay = 0 }) => {
    const segments = segmentMaps.hex[digit?.toUpperCase()] || [0, 0, 0, 0, 0, 0, 0]
    
    const segmentStyle = (isActive, index) => ({
      position: 'absolute',
      backgroundColor: isActive ? '#ff3333' : '#2a2a2a',
      transition: animate ? `all ${0.3 + (index * 0.1)}s ease ${delay}s` : 'all 0.3s ease',
      boxShadow: isActive ? '0 0 15px #ff3333, inset 0 0 10px rgba(255, 51, 51, 0.3)' : 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
      borderRadius: '2px',
      transform: animate && isActive ? 'scale(1.05)' : 'scale(1)'
    })

    return (
      <div style={{
        position: 'relative',
        width: '80px',
        height: '120px',
        margin: '20px'
      }}>
        {/* Segmento a (superior) */}
        <div style={{
          ...segmentStyle(segments[0], 0),
          top: '0px',
          left: '10px',
          width: '60px',
          height: '8px',
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
        }} />
        
        {/* Segmento b (superior derecho) */}
        <div style={{
          ...segmentStyle(segments[1], 1),
          top: '5px',
          left: '65px',
          width: '8px',
          height: '50px',
          clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)'
        }} />
        
        {/* Segmento c (inferior derecho) */}
        <div style={{
          ...segmentStyle(segments[2], 2),
          top: '60px',
          left: '65px',
          width: '8px',
          height: '50px',
          clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)'
        }} />
        
        {/* Segmento d (inferior) */}
        <div style={{
          ...segmentStyle(segments[3], 3),
          top: '112px',
          left: '10px',
          width: '60px',
          height: '8px',
          clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)'
        }} />
        
        {/* Segmento e (inferior izquierdo) */}
        <div style={{
          ...segmentStyle(segments[4], 4),
          top: '60px',
          left: '7px',
          width: '8px',
          height: '50px',
          clipPath: 'polygon(100% 0%, 0% 15%, 0% 85%, 100% 100%)'
        }} />
        
        {/* Segmento f (superior izquierdo) */}
        <div style={{
          ...segmentStyle(segments[5], 5),
          top: '5px',
          left: '7px',
          width: '8px',
          height: '50px',
          clipPath: 'polygon(100% 0%, 0% 15%, 0% 85%, 100% 100%)'
        }} />
        
        {/* Segmento g (medio) */}
        <div style={{
          ...segmentStyle(segments[6], 6),
          top: '56px',
          left: '10px',
          width: '60px',
          height: '8px',
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
        }} />
      </div>
    )
  }

  const handleValueChange = (e) => {
    // Función eliminada - solo modo contador
  }

  const startStopCounter = () => {
    setIsCounterRunning(!isCounterRunning)
  }

  const resetCounter = () => {
    setCounterValue(0)
    setDisplayValue('0')
    setIsCounterRunning(false)
  }

  const handleAnimationToggle = (e) => {
    setAnimate(e.target.checked)
    if (e.target.checked) {
      setAnimationKey(prev => prev + 1)
    }
  }

  const convertValue = (value, fromBase, toBase) => {
    try {
      const decimal = parseInt(value, parseInt(fromBase))
      if (isNaN(decimal)) return ''
      return decimal.toString(parseInt(toBase)).toUpperCase()
    } catch {
      return ''
    }
  }

  useEffect(() => {
    // Inicializar con valor 0
    setDisplayValue('0')
    // Trigger animation when base changes
    if (animate) {
      setAnimationKey(prev => prev + 1)
    }
  }, [base])

  // Efecto para el contador automático
  useEffect(() => {
    let interval
    if (isCounterRunning) {
      interval = setInterval(() => {
        setCounterValue(prev => {
          const next = (prev + 1) % (maxValue + 1)
          setDisplayValue(next.toString(parseInt(base)).toUpperCase())
          if (animate) {
            setAnimationKey(prevKey => prevKey + 1)
          }
          return next
        })
      }, counterSpeed)
    }
    return () => clearInterval(interval)
  }, [isCounterRunning, maxValue, counterSpeed, base, animate])

  // Efecto para actualizar display cuando cambia counterValue
  useEffect(() => {
    setDisplayValue(counterValue.toString(parseInt(base)).toUpperCase())
  }, [counterValue, base])

  return (
    <section className="section">
      <h2 className="section-title">⏱️ Contador Digital con Módulo</h2>
      
      <div className="controls">
        <div className="control-group">
          <label>Velocidad del contador:</label>
          <select 
            value={counterSpeed} 
            onChange={(e) => setCounterSpeed(parseInt(e.target.value))}
          >
            <option value="100">Muy Rápido (100ms)</option>
            <option value="500">Rápido (500ms)</option>
            <option value="1000">Normal (1s)</option>
            <option value="2000">Lento (2s)</option>
            <option value="3000">Muy Lento (3s)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Módulo (máx valor):</label>
          <select 
            value={maxValue} 
            onChange={(e) => {
              setMaxValue(parseInt(e.target.value))
              setCounterValue(0)
              setDisplayValue('0')
            }}
          >
            <option value="7">8 (0-7) - Octal</option>
            <option value="9">10 (0-9) - Decimal</option>
            <option value="15">16 (0-F) - Hexadecimal</option>
            <option value="3">4 (0-3) - 2 bits</option>
            <option value="1">2 (0-1) - Binario</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Base numérica:</label>
          <select 
            value={base} 
            onChange={(e) => setBase(e.target.value)}
          >
            <option value="2">Binario (0-1)</option>
            <option value="8">Octal (0-7)</option>
            <option value="10">Decimal (0-9)</option>
            <option value="16">Hexadecimal (0-F)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={animate}
              onChange={handleAnimationToggle}
            />
            Animación de segmentos
          </label>
        </div>
        
        <div className="control-group">
          <button 
            onClick={startStopCounter}
            style={{
              padding: '12px 24px',
              backgroundColor: isCounterRunning ? '#e74c3c' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '15px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isCounterRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
          </button>
          <button 
            onClick={resetCounter}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="modulo-explanation">
        <h3>🔄 Concepto del Módulo en Contadores Digitales</h3>
        <div className="explanation-grid">
          <div className="explanation-item">
            <h4>🔢 ¿Qué es el Módulo?</h4>
            <p>
              El módulo (%) es una operación que devuelve el resto de una división. 
              En contadores digitales, simula un "reinicio automático" cuando se alcanza el valor máximo.
            </p>
            <p>
              <strong>Fórmula:</strong> <code>contador = (contador + 1) % máximo</code>
            </p>
            <p>
              <strong>Ejemplo:</strong> En módulo 8: 0→1→2→3→4→5→6→7→0...
            </p>
          </div>
          
          <div className="explanation-item">
            <h4>🕒 Aplicación Práctica</h4>
            <p>
              Los relojes usan módulo constantemente:
            </p>
            <ul>
              <li>Horas: 0-23 (módulo 24)</li>
              <li>Minutos/segundos: 0-59 (módulo 60)</li>
              <li>Días de semana: 0-6 (módulo 7)</li>
            </ul>
            <p>
              <strong>Ejemplo de reloj:</strong> Después de 23:59, viene 00:00
            </p>
          </div>
          
          <div className="explanation-item">
            <h4>📊 Estado Actual del Contador</h4>
            <div className="counter-stats">
              <p><strong>Valor actual:</strong> {counterValue}</p>
              <p><strong>En base {base}:</strong> {displayValue}</p>
              <p><strong>Módulo:</strong> {maxValue + 1}</p>
              <p><strong>Próximo valor:</strong> {(counterValue + 1) % (maxValue + 1)}</p>
              <p><strong>Estado:</strong> {isCounterRunning ? '🟢 Ejecutándose' : '🔴 Pausado'}</p>
              <p><strong>Ciclos completados:</strong> {Math.floor(counterValue / (maxValue + 1))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="display-area">
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
          🖥️ Display de 7 Segmentos - Valor: {displayValue}
        </h3>
        <div style={{
          background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
          padding: '40px',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '250px',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.3)',
          border: '3px solid #333'
        }}>
          {displayValue.split('').map((digit, index) => (
            <SevenSegment 
              key={`${digit}-${index}-${animationKey}`} 
              digit={digit} 
              animate={animate}
              delay={index * 0.2}
            />
          ))}
          {displayValue === '' && (
            <div style={{ color: '#888', fontSize: '1.4rem', fontWeight: 'bold' }}>
              Contador inicializando...
            </div>
          )}
        </div>
      </div>

      <div className="display-area">
        <div className="result-display">
          <h3>⏱️ Estado del Contador Digital</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '20px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            <div><strong style={{color: '#f39c12'}}>Valor actual (decimal):</strong> {counterValue}</div>
            <div><strong style={{color: '#e74c3c'}}>Valor en base {base}:</strong> {displayValue}</div>
            <div><strong style={{color: '#3498db'}}>Rango del contador:</strong> 0 - {maxValue}</div>
            <div><strong style={{color: '#27ae60'}}>Próximo tick:</strong> {(counterValue + 1) % (maxValue + 1)}</div>
            <div><strong style={{color: '#9b59b6'}}>Equivalente binario:</strong> {convertValue(displayValue, base, '2')}</div>
            <div><strong style={{color: '#e67e22'}}>Equivalente hexadecimal:</strong> {convertValue(displayValue, base, '16')}</div>
          </div>
        </div>
        
        <div className="result-display">
          <h3>📱 Aplicaciones de Contadores Modulares</h3>
          <p style={{color: '#2c3e50', fontWeight: '500'}}>Los contadores modulares son fundamentales en electrónica digital y programación. Este simulador demuestra cómo funcionan los ciclos automáticos en sistemas digitales.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div style={{backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', border: '2px solid #3498db'}}>
              <h4 style={{color: '#2980b9'}}>🕐 Sistemas de Tiempo</h4>
              <ul style={{color: '#34495e'}}>
                <li>Relojes digitales (12h/24h)</li>
                <li>Temporizadores y cronómetros</li>
                <li>Sistemas de alarma</li>
              </ul>
            </div>
            <div style={{backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', border: '2px solid #e74c3c'}}>
              <h4 style={{color: '#c0392b'}}>💻 Computación</h4>
              <ul style={{color: '#34495e'}}>
                <li>Contadores de programa</li>
                <li>Direccionamiento de memoria</li>
                <li>Generadores de secuencias</li>
              </ul>
            </div>
            <div style={{backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px', border: '2px solid #27ae60'}}>
              <h4 style={{color: '#229954'}}>🔧 Control Industrial</h4>
              <ul style={{color: '#34495e'}}>
                <li>Contadores de producción</li>
                <li>Sistemas de inventario</li>
                <li>Control de procesos</li>
              </ul>
            </div>
          </div>
          <p style={{ marginTop: '15px', fontStyle: 'italic', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '2px solid #f39c12', color: '#e67e22', fontWeight: 'bold' }}>
            <strong>💡 Tip:</strong> Observa cómo el contador vuelve a 0 automáticamente al alcanzar el valor máximo. 
            Esto es exactamente lo que sucede en un reloj cuando pasa de 23:59 a 00:00.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SevenSegmentDisplay
