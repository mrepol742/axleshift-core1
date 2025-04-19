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
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const storedTheme = useSelector((state) => state.theme)

    return (
        <CSidebar
            className="border-end sidebar"
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
                        src={storedTheme === 'light' ? '/images/logo-dark.png' : '/images/logo.png'}
                        className="sidebar-brand-full"
                        width={150}
                        alt="Logo"
                        height={30}
                        loading="lazy"
                    />
                    <CImage
                        src={
                            storedTheme === 'light'
                                ? '/images/favicon-dark.png'
                                : '/images/favicon.png'
                        }
                        className="sidebar-brand-narrow"
                        height={30}
                        alt="Logo"
                        width={30}
                        loading="lazy"
                    />
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
            <AppSidebarNav items={navigation} />
            <CSidebarFooter className="d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(AppSidebar)
