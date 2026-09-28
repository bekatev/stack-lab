import { createContext, useContext, useState } from 'react'

const LabContext = createContext(null)

export function LabProvider({ children }) {
  const [spinePlaying, setSpinePlaying] = useState(true)
  const [showGuide, setShowGuide] = useState(true)

  const value = {
    spinePlaying,
    showGuide,
    toggleSpine() {
      setSpinePlaying((playing) => !playing)
    },
    toggleGuide() {
      setShowGuide((visible) => !visible)
    },
  }

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>
}

export function useLab() {
  const context = useContext(LabContext)
  if (!context) {
    throw new Error('useLab must be used inside LabProvider')
  }
  return context
}
