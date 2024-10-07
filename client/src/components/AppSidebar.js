import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    CImage,
    CCloseButton,
    CSidebar,
    CSidebarBrand,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
    CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)

    return (
        <CSidebar
            className="border-end"
            colorScheme="dark"
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarHeader>
                <CSidebarBrand to="/">
                    <CImage
                        fluid
                        src="/images/logo.png"
                        className="sidebar-brand-full"
                        height={30}
                    />
                    <CImage
                        src="/images/favicon.png"
                        className="sidebar-brand-narrow"
                        height={30}
                    />
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
            <AppSidebarNav items={navigation} />
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(AppSidebar)
