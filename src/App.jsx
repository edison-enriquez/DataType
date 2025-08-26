import React, { useState, useEffect } from 'react'
import SevenSegmentDisplay from './components/SevenSegmentDisplay'
import BitOperations from './components/BitOperations'
import BinaryAdder from './components/BinaryAdder'
import BaseConverter from './components/BaseConverter'
import DataTypeExplorer from './components/DataTypeExplorer'

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>DataType Explorer</h1>
        <p>Aprende sobre tipos de datos, operaciones binarias y sistemas numéricos</p>
      </header>
      
      <main className="main-content">
        <DataTypeExplorer />
        <BaseConverter />
        <SevenSegmentDisplay />
        <BitOperations />
        <BinaryAdder />
      </main>
    </div>
  )
}

export default App
