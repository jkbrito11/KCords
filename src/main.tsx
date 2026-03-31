import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		let isRefreshing = false

		navigator.serviceWorker.addEventListener('controllerchange', () => {
			if (isRefreshing) {
				return
			}
			isRefreshing = true
			window.location.reload()
		})

		navigator.serviceWorker.register('/sw.js').then((registration) => {
			if (registration.waiting) {
				registration.waiting.postMessage({ type: 'SKIP_WAITING' })
			}

			registration.addEventListener('updatefound', () => {
				const installingWorker = registration.installing
				if (!installingWorker) {
					return
				}

				installingWorker.addEventListener('statechange', () => {
					if (
						installingWorker.state === 'installed' &&
						navigator.serviceWorker.controller
					) {
						installingWorker.postMessage({ type: 'SKIP_WAITING' })
					}
				})
			})

			// Proactively check for updates while app stays open.
			window.setInterval(() => {
				registration.update().catch(() => {
					// Ignore transient update errors.
				})
			}, 60_000)
		}).catch((error) => {
			console.error('Service worker registration failed:', error)
		})
	})
}

render(<App />, document.getElementById('app')!)
