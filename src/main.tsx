import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/main.css'
import { TextCalcApp } from './components/textCalcApp'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nProvider>
            <TextCalcApp />
        </I18nProvider>
    </StrictMode>,
)
