import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/main.css'
import { TextCalcApp } from './components/textCalcApp'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TextCalcApp />
    </StrictMode>,
)
