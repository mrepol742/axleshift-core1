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
import { VITE_APP_RECAPTCHA_SITE_KEY } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import parseTimestamp from '../../utils/Timestamp'
import { useToast } from '../../components/AppToastProvider'

const Webhooks = () => {
    const recaptchaRef = React.useRef()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState([])
    const [WebhooksLocationList, setWebhooksLocationList] = useState([])

    const fetchData = async () => {
        // axios
        //     .get(`/sec/Webhooks`)
        //     .then((response) => setResult(response.data))
        //     .catch((error) => {
        //         const message =
        //             error.response?.data?.error || error.message || 'Server is offline or restarting please wait'
        //         addToast(message)
        //     })
        //     .finally(() => setLoading(false))
    }

    const saveData = async () => {
        // const recaptcha = await recaptchaRef.current.executeAsync()
        // setLoading(true)
        // axios
        //     .post(`/sec/webhooks`, { recaptcha_ref: recaptcha, WebhooksLocationList })
        //     .then((response) => addToast('Changes saved successfully', 'Success'))
        //     .catch((error) => {
        //         const message =
        //             error.response?.data?.error || error.message || 'Server is offline or restarting please wait'
        //         addToast(message)
        //     })
        //     .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddWebhooks = () => {
        setWebhooksLocationList([...WebhooksLocationList, { url: '', checked: false }])
    }

    const handleWebhooksChange = (index, value) => {
        const newWebhooksLocationList = [...WebhooksLocationList]
        newWebhooksLocationList[index].ip = value
        setWebhooksLocationList(newWebhooksLocationList)
    }

    const handleCheckboxChange = (index, checked) => {
        const newWebhooksLocationList = [...WebhooksLocationList]
        newWebhooksLocationList[index].checked = checked
        setWebhooksLocationList(newWebhooksLocationList)
    }

    const handleDeleteWebhooks = () => {
        setWebhooksLocationList(WebhooksLocationList.filter((item) => !item.checked))
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

            <CRow className="align-items-center mb-2">
                <CCol>
                    <h4 className="mb-0">Webhooks</h4>
                </CCol>
                <CCol className="text-right d-flex justify-content-end">
                    <CButton color="primary" onClick={handleAddWebhooks}>
                        New
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteWebhooks} className="ms-2">
                        Delete
                    </CButton>
                </CCol>
            </CRow>
            {WebhooksLocationList.map((item, index) => (
                <div key={index} className="d-flex mb-2">
                    <input
                        className="me-3"
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <CFormInput
                        type="text"
                        value={item.url}
                        onChange={(e) => handleWebhooksChange(index, e.target.value, 'url')}
                        placeholder="https://"
                        className="me-2"
                    />
                    <CFormInput
                        type="text"
                        value={item.action}
                        onChange={(e) => handleWebhooksChange(index, e.target.value, 'action')}
                        placeholder="Action"
                    />
                </div>
            ))}
            {WebhooksLocationList.length != 0 && (
                <CButton color="primary" onClick={saveData} className="mb-4">
                    Apply all changes
                </CButton>
            )}
        </div>
    )
}

export default Webhooks
