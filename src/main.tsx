import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((error) => {
			console.error('Falha ao registrar Service Worker:', error)
		})
	})
}

render(<App />, document.getElementById('app')!)
