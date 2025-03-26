import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
    CToaster,
    CToast,
    CToastHeader,
    CToastBody,
    CImage,
    CModal,
    CButton,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { useUserProvider } from '../UserProvider'

const IdleTimeout = ({ children }) => {
    const { user } = useUserProvider()
    const IDLE_TIMEOUT = 10 * 60 * 1000
    const COUNTDOWN_TIME = 30
    const [isIdle, setIsIdle] = useState(false)
    const [countdown, setCountdown] = useState(COUNTDOWN_TIME)
    let timeout, countdownInterval

    const resetTimer = useCallback(() => {
        clearTimeout(timeout)
        clearInterval(countdownInterval)
        setIsIdle(false)
        setCountdown(COUNTDOWN_TIME)

        timeout = setTimeout(() => {
            setIsIdle(true)
            startCountdown()
        }, IDLE_TIMEOUT)
    }, [])

    const startCountdown = () => {
        countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval)
                    logout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const logout = () => {
        window.location.href = '/logout'
    }

    const time = () => {
        if (!user.role) return
        resetTimer()
        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('keydown', resetTimer)
        window.addEventListener('click', resetTimer)
    }

    useEffect(() => {
        time()

        return () => {
            clearTimeout(timeout)
            clearInterval(countdownInterval)
            window.removeEventListener('mousemove', resetTimer)
            window.removeEventListener('keydown', resetTimer)
            window.removeEventListener('click', resetTimer)
        }
    }, [resetTimer])

    return (
        <div>
            {isIdle && (
                <div
                    className="position-fixed top-50 start-50 translate-middle p-3"
                    style={{ zIndex: 1050 }}
                >
                    <CModal
                        alignment="center"
                        visible={isIdle}
                        onClose={(e) => setIsIdle(false)}
                        aria-labelledby="warningModal"
                    >
                        <CModalHeader>
                            <CModalTitle id="warningModal">Are you still here?</CModalTitle>
                        </CModalHeader>
                        <CModalBody>You will be logged out in {countdown} seconds.</CModalBody>
                        <CModalFooter>
                            <CButton
                                color="primary"
                                onClick={(e) => {
                                    setVisibility(false)
                                    resetTimer()
                                }}
                            >
                                Stay Logged In
                            </CButton>
                        </CModalFooter>
                    </CModal>
                </div>
            )}
            {children}
        </div>
    )
}

export default React.memo(IdleTimeout)

IdleTimeout.propTypes = {
    children: PropTypes.node.isRequired,
}
