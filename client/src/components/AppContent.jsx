import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../routes'

const AppContent = () => {
    return (
        <CContainer className="px-4" lg>
            <Suspense
                fallback={
                    <div className="loading-overlay">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Routes>
                    {routes.map((route, idx) => {
                        return (
                            !route.external && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    element={<route.element />}
                                />
                            )
                        )
                    })}
                </Routes>
            </Suspense>
        </CContainer>
    )
}

export default React.memo(AppContent)
