import React, { useEffect, useState } from 'react'
import {
    CInputGroup,
    CFormInput,
    CInputGroupText,
    CForm,
    CFormSelect,
    CRow,
    CCol,
    CCard,
    CCardTitle,
    CSpinner,
    CCardBody,
    CTable,
    CTableHead,
    CTableRow,
    CTableDataCell,
    CTableBody,
    CTableHeaderCell,
    CFormSwitch,
    CButton,
    CAlert,
} from '@coreui/react'
import ReCAPTCHA from 'react-google-recaptcha'
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../../utils/Timestamp'
import { useToast } from '../../../components/AppToastProvider'

const GEO = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [order, setOrder] = useState(0)
    const [priority, setPriority] = useState(0)
    const [state, setState] = useState(0)
    const [geoLocationList, setGeoLocationList] = useState([])

    const fetchData = async () => {
        axios
            .get(`/sec/management/geo`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const saveData = async () => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/sec/management/geo-filtering`, { recaptcha_ref: recaptcha, geoLocationList })
            .then((response) => addToast('Changes saved successfully', 'Success'))
            .catch((error) => {
                const message =
                    error.response?.data?.error ||
                    (error.message === 'network error'
                        ? 'Server is offline or restarting please wait'
                        : error.message)
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddGeo = () => {
        setGeoLocationList([...geoLocationList, { ip: '', checked: false }])
    }

    const handleGeoChange = (index, value) => {
        const newgeoLocationList = [...geoLocationList]
        newgeoLocationList[index].ip = value
        setGeoLocationList(newgeoLocationList)
    }

    const handleCheckboxChange = (index, checked) => {
        const newgeoLocationList = [...geoLocationList]
        newgeoLocationList[index].checked = checked
        setGeoLocationList(newgeoLocationList)
    }

    const handleDeleteGeo = () => {
        setGeoLocationList(geoLocationList.filter((item) => !item.checked))
    }

    if (loading)
        return (
            <div className="loading-overlay">
                <CSpinner color="primary" variant="grow" />
            </div>
        )

    return (
        <div>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={VITE_APP_RECAPTCHA_SITE_KEY} />

            <CAlert color="warning" className="small">
                <FontAwesomeIcon icon={faCircleExclamation} className="me-2" /> Block or allow
                specific set of coordinates on who can access this platform via login or
                registration.
            </CAlert>

            <CRow className="align-items-center mb-2">
                <CCol>
                    <h4 className="mb-0">GeoLocation Filtering</h4>
                </CCol>
                <CCol className="text-right d-flex justify-content-end">
                    <CButton color="primary" onClick={handleAddGeo}>
                        New
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteGeo} className="ms-2">
                        Delete
                    </CButton>
                </CCol>
            </CRow>
            <CRow className="align-items-center mb-2">
                <CCol className="d-flex align-items-center">
                    <span className="me-3">Filter Mode:</span>
                    <CFormSelect
                        aria-label="Select whitelist or blacklist"
                        onChange={(e) => setState(e.target.value)}
                        className="w-auto"
                    >
                        <option value="0">Whitelist</option>
                        <option value="1">Blacklist</option>
                    </CFormSelect>
                </CCol>
            </CRow>
            {geoLocationList.map((item, index) => (
                <div key={index} className="d-flex mb-2">
                    <input
                        className="me-3"
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <CFormInput
                        type="text"
                        value={item.latitude}
                        onChange={(e) => handleGeoChange(index, e.target.value, 'latitude')}
                        placeholder="Enter Latitude"
                        className="me-2"
                    />
                    <CFormInput
                        type="text"
                        value={item.longitude}
                        onChange={(e) => handleGeoChange(index, e.target.value, 'longitude')}
                        placeholder="Enter Longitude"
                    />
                </div>
            ))}
            {geoLocationList.length != 0 && (
                <CButton color="primary" onClick={saveData} className="mb-4">
                    Apply all changes
                </CButton>
            )}
        </div>
    )
}

export default GEO
