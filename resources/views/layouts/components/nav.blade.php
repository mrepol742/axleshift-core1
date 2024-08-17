<nav class="navbar navbar-expand-md navbar-light bg-white">
    <div class="container-fluid">

        <div class="navbar-brand">
            @if (Auth::check())
            <button class="toggle-btn mx-2" type="button">
                <i class="fa-solid fa-bars"></i>
            </button>
            @endif
            <span class="d-none d-md-inline">{{ config('app.name') }}</span>
        </div>

        {{--
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        --}}

        <div class="" id="navbarSupportedContent">

            {{-- Left Side --}}
            {{-- Edit this base on your system needs --}}
            {{--
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                </li>
            </ul>
            --}}

            {{-- Right Side --}}
            {{-- Edit this base on your system needs--}}
            <ul class="navbar-nav ms-auto mx-3">

                @guest
                @if (Route::has('login'))
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>
                </li>
                @endif

                @if (Route::has('register'))
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                </li>
                @endif
                @endguest
            </ul>

            {{-- Search --}}
            {{--
            <form class="d-flex" role="search" method='get' action='/search'>
                <div class="input-group">
                    <input type="search" class="form-control" name="q" placeholder="Search" aria-label="Search" aria-describedby="search-addon">
                    <button class="btn btn-outline-primary" id="search-addon" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </form>
            --}}

            @if (Auth::check())
            <ul class="navbar-nav mx-3">
                <li class="nav-item dropdown">
                    <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                        {{ Auth::user()->first_name }}
                    </a>

                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                            {{ __('Logout') }}
                        </a>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                    </div>
                </li>
            </ul>
            @endif
        </div>
    </div>
</nav>