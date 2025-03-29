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

const IPFiltering = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState([])
    const [query, setQuery] = useState('')
    const [order, setOrder] = useState(0)
    const [priority, setPriority] = useState(0)
    const [state, setState] = useState(0)
    const [ipList, setIpList] = useState([])

    const fetchData = async () => {
        axios
            .get(`/sec/management/ip-filtering`)
            .then((response) => setResult(response.data))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    const saveData = async () => {
        const recaptcha = await recaptchaRef.current.executeAsync()
        setLoading(true)
        axios
            .post(`/sec/management/ip-filtering`, { recaptcha_ref: recaptcha, ipList })
            .then((response) => addToast('Changes saved successfully', 'Success'))
            .catch((error) => {
                const message =
                    error.response?.data?.error || 'Server is offline or restarting please wait'
                addToast(message)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddIp = () => {
        setIpList([...ipList, { ip: '', checked: false }])
    }

    const handleIpChange = (index, value) => {
        const newIpList = [...ipList]
        newIpList[index].ip = value
        setIpList(newIpList)
    }

    const handleCheckboxChange = (index, checked) => {
        const newIpList = [...ipList]
        newIpList[index].checked = checked
        setIpList(newIpList)
    }

    const handleDeleteIp = () => {
        setIpList(ipList.filter((item) => !item.checked))
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
                specific set of address on who can access this platform.
            </CAlert>

            <CRow className="align-items-center mb-2">
                <CCol>
                    <h4 className="mb-0">IP Filtering</h4>
                </CCol>
                <CCol className="text-right d-flex justify-content-end">
                    <CButton color="primary" onClick={handleAddIp}>
                        New
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteIp} className="ms-2">
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
            {ipList.map((item, index) => (
                <div key={index} className="d-flex mb-2">
                    <input
                        className="me-3"
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <CFormInput
                        type="text"
                        value={item.ip}
                        onChange={(e) => handleIpChange(index, e.target.value)}
                        placeholder="Enter IP address"
                    />
                </div>
            ))}
            {ipList.length != 0 && (
                <CButton color="primary" onClick={saveData} className="mb-4">
                    Apply all changes
                </CButton>
            )}
            <div className="text-muted">
                Examples:
                <ul>
                    <li>Single IP: 192.168.100.1</li>
                    <li>Prefix IP: 192.168.100.1/24</li>
                    <li>IP Range: 192.168.100.1-192.168.100.200</li>
                </ul>
            </div>
        </div>
    )
}

export default IPFiltering
