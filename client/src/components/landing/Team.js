import React from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardImage,
    CCardTitle,
    CCardText,
    CCardBody,
    CImage,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faRoute, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Team = () => {
    AOS.init()
    const teamMembers = [
        {
            name: 'Melvin Jones Repol',
            major: 'IM',
            image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
        },
        {
            name: 'John Reybel Pilon',
            major: 'IM',
            image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
        },
        {
            name: 'Maresa Gregana',
            major: 'NA',
            image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
        },
        {
            name: 'Jullana Mariz Jovenal',
            major: 'IS',
            image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
        },
        {
            name: 'Kenneth Pameroyan',
            major: 'IS',
            image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
        },
    ]

    return (
        <CContainer fluid className="h-100 p-5">
            <div className="mt-5 text-center mb-5" data-aos="fade-down">
                <span>TEAM</span>
                <h2 className="text-primary">Our Tech-savy Team</h2>
            </div>
            <CRow>
                {teamMembers.map((member, index) => (
                    <CCol key={index} xs={12} md={4} className="mb-4" data-aos="fade-up-left">
                        <div className="text-center d-flex flex-column justify-content-center">
                            <CImage
                                src={member.image}
                                className="rounded-pill mx-auto mb-2 border border-primary p-1"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <div className="d-flex flex-column align-items-center">
                                <h4>{member.name}</h4>
                                <span>{member.major}</span>
                            </div>
                        </div>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    )
}

export default Team
