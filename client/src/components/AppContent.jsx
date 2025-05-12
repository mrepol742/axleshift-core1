import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import routes from '../routes'
import { useUserProvider } from '../components/UserProvider'

const AppContent = () => {
    const { user } = useUserProvider()

    return (
        <div className="px-2 px-md-4">
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
                            !route.external &&
                            !route.roles.includes(user.role) && (
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
        </div>
    )
}

export default React.memo(AppContent)
