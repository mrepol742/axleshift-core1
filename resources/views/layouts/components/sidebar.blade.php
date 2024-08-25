<aside id="sidebar" class="expand">
    <ul class="sidebar-nav bg-white">
        <li class="sidebar-item {{ Request::path() == '/' ? 'active' : ''  }}">
            <a href="/" class="sidebar-link">
                <i class="fa-solid fa-house"></i>
                <span>Overview</span>
            </a>
        </li>
        <li class="sidebar-item">
            
            <a href="#" class="sidebar-link has-dropdown" data-bs-toggle="collapse"
                data-bs-target="#multi" aria-expanded="true" aria-controls="multi">
                <i class="fa-regular fa-paper-plane"></i>
                <span>Shipping Services</span>
            </a>
            <ul id="multi" class="sidebar-dropdown list-unstyled collapse show" data-bs-parent="#sidebar">
                <li class="sidebar-item mx-4">
                    <a href="/freight/land" class="sidebar-link {{ Request::path() == 'freight/land' ? 'active' : ''  }}"><i class="fa-solid fa-truck"></i> Land Freight</a>
        </li>
        <li class="sidebar-item mx-4">
            <a href="/freight/air" class="sidebar-link {{ Request::path() == 'freight/air' ? 'active' : ''  }}"><i class="fa-solid fa-plane-departure"></i> Air Freight</a>
        </li>
        <li class="sidebar-item mx-4">
            <a href="/freight/sea" class="sidebar-link {{ Request::path() == 'freight/sea' ? 'active' : ''  }}"><i class="fa-solid fa-ship"></i> Sea Freight</a>
        </li>
    </ul>
    </li>
    <hr class="mx-4">
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">
            <i class="fa-solid fa-folder"></i>
            <span>Document and Package</span>
        </a>
    </li>
    <li class="sidebar-item">
        <a href="#" class="sidebar-link">
            <i class="fa-solid fa-folder"></i>
            <span>Containers and Cargo</span>
        </a>
    </li>
    </ul>
</aside>