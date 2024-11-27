import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CTabs, CTabList, CTab, CTabContent, CTabPanel, CSpinner } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture, faTruck, faShip } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components/AppToastProvider'
import errorMessages from '../../utils/ErrorMessages'
import Panel from './Panel'

const Rates = () => {
    const { addToast } = useToast()
    const [activeItemKey, setActiveItemKey] = useState(0)
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const navigate = useNavigate()
    const tab = window.location.hash ? window.location.hash.substring(1) : ''

    const handleTabChange = (itemKey, tabName) => {
        navigate(`#${tabName}`)
    }

    const fetchData = async () => {
        axios
            .get(`/rates`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    errorMessages[error.status] || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (!tab && tab.length == 0) handleTabChange(0, 'air')
        switch (tab) {
            case 'air':
                setActiveItemKey(0)
                break
            case 'land':
                setActiveItemKey(1)
                break
            case 'sea':
                setActiveItemKey(2)
                break
        }
        fetchData()
    }, [])

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <CSpinner color="primary" variant="grow" />
                </div>
            )}

            {!loading && (
                <CTabs activeItemKey={activeItemKey} className="mb-4">
                    <CTabList variant="underline-border">
                        <CTab
                            aria-controls="air-tab-pane"
                            itemKey={0}
                            onClick={() => handleTabChange(0, 'air')}
                        >
                            <FontAwesomeIcon icon={faPlaneDeparture} className="me-1" /> Air Freight
                        </CTab>
                        <CTab
                            aria-controls="land-tab-pane"
                            itemKey={1}
                            onClick={() => handleTabChange(1, 'land')}
                        >
                            <FontAwesomeIcon icon={faTruck} className="me-1" /> Land Freight
                        </CTab>
                        <CTab
                            aria-controls="sea-tab-pane"
                            itemKey={2}
                            onClick={() => handleTabChange(2, 'sea')}
                        >
                            <FontAwesomeIcon icon={faShip} className="me-1" /> Sea Freight
                        </CTab>
                    </CTabList>
                    <CTabContent>
                        <CTabPanel className="py-3" aria-labelledby="air-tab-pane" itemKey={0}>
                            <Panel result={result} type="air" />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="land-tab-pane" itemKey={1}>
                            <Panel result={result} type="land" />
                        </CTabPanel>
                        <CTabPanel className="py-3" aria-labelledby="sea-tab-pane" itemKey={2}>
                            <Panel result={result} type="sea" />
                        </CTabPanel>
                    </CTabContent>
                </CTabs>
            )}
        </div>
    )
}

export default Rates
