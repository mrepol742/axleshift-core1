import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import store from './store'
import { Provider } from 'react-redux'
import './bootstrap'
import App from './views/landing'

describe('App tests', () => {
    it('should contains the heading title', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>,
        )
        const heading = screen.getByText(/Where Freight Meets Efficiency/i)
        expect(heading).toBeInTheDocument()
    })
})
