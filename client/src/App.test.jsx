import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import store from './store'
import './bootstrap'
import { Provider } from 'react-redux'
import App from './views/landing/index'

describe('App tests', () => {
    it('should contains the heading title', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>,
        )
        const headings = screen.getAllByText(/Freight/i)
        expect(headings.length).toBeGreaterThan(0)
    })
})
