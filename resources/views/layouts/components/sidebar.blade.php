<aside id="sidebar" class="expand">
    <ul class="sidebar-nav bg-white">
        <li class="sidebar-item {{ Request::path() == '/' ? 'active' : ''  }}">
            <a href="/" class="sidebar-link">
                <i class="fa-solid fa-house"></i>
                <span>Overview</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="#" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                data-bs-target="#multi" aria-expanded="true" aria-controls="multi">
                <i class="fa-solid fa-house"></i>
                <span>Item 1</span>
            </a>
            <ul id="multi" class="sidebar-dropdown list-unstyled collapse show" data-bs-parent="#sidebar">
                <li class="sidebar-item mx-4">
                    <a href="{{ route('subitem') }}" class="sidebar-link {{ Request::path() == 'subitem' ? 'active' : ''  }}">Sub Item 1</a>
                </li>
                <li class="sidebar-item mx-4">
                    <a href="{{ route('subitem1') }}" class="sidebar-link {{ Request::path() == 'subitem1' ? 'active' : ''  }}">Sub Item 2</a>
                </li>
            </ul>
        </li>
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
            <i class="fa-solid fa-house"></i>
                <span>Item 2</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
            <i class="fa-solid fa-house"></i>
                <span>Item 3</span>
            </a>
        </li>
        <hr class="mx-4">
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
            <i class="fa-solid fa-house"></i>
                <span>Item 4</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="#" class="sidebar-link">
            <i class="fa-solid fa-house"></i>
                <span>Item 5</span>
            </a>
        </li>
    </ul>
</aside>