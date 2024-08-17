@if ($paginator->hasPages())
    <nav>
        <ul class="pagination">
            @if ($paginator->onFirstPage())
                <li class="page-item disabled" aria-disabled="true">
                    <span class="page-link">&lsaquo;</span>
                </li>
            @else
                <li class="page-item">
                    @php
                        $queryString = Request::getQueryString();
                        parse_str($queryString, $queryArray);
                        unset($queryArray['page']);
                        $updatedQueryString = http_build_query($queryArray);
                    @endphp

                    <a class="page-link"
                        href="{{ $paginator->previousPageUrl() }}{{ $updatedQueryString ? '&' . $updatedQueryString : '' }}"
                        rel="prev" aria-label="Previous">&lsaquo;</a>
                </li>
            @endif

            @php
                $showMax = 5;
                $remainingPages = $paginator->lastPage() - $paginator->currentPage();
                $startPage = max(1, $paginator->currentPage() - floor($showMax / 2));
                $endPage = min($paginator->lastPage(), $startPage + $showMax - 1);
            @endphp

            @if ($startPage > 1)
                <li class="page-item">
                    @php
                        $queryString = Request::getQueryString();
                        parse_str($queryString, $queryArray);
                        unset($queryArray['page']);
                        $updatedQueryString = http_build_query($queryArray);
                    @endphp
                    <a class="page-link"
                        href="{{ $paginator->url(1) }}{{ $updatedQueryString ? '&' . $updatedQueryString : '' }}">1</a>
                </li>
                @if ($startPage > 2)
                    <li class="page-item disabled" aria-disabled="true"><span class="page-link">&hellip;</span></li>
                @endif
            @endif

            @for ($i = $startPage; $i <= $endPage; $i++)
                @if ($i == $paginator->currentPage())
                    <li class="page-item active" aria-current="page">
                        <span class="page-link">{{ $i }}</span>
                    </li>
                @else
                    <li class="page-item">
                        @php
                            $queryString = Request::getQueryString();
                            parse_str($queryString, $queryArray);
                            unset($queryArray['page']);
                            $updatedQueryString = http_build_query($queryArray);
                        @endphp
                        <a class="page-link"
                            href="{{ $paginator->url($i) }}{{ $updatedQueryString ? '&' . $updatedQueryString : '' }}">{{ $i }}</a>
                    </li>
                @endif
            @endfor

            @if ($remainingPages > $showMax)
                @if ($endPage < $paginator->lastPage() - 1)
                    <li class="page-item disabled" aria-disabled="true"><span class="page-link">&hellip;</span></li>
                @endif
                <li class="page-item">
                    @php
                        $queryString = Request::getQueryString();
                        parse_str($queryString, $queryArray);
                        unset($queryArray['page']);
                        $updatedQueryString = http_build_query($queryArray);
                    @endphp
                    <a class="page-link"
                        href="{{ $paginator->url($paginator->lastPage()) }}{{ $updatedQueryString ? '&' . $updatedQueryString : '' }}">{{ $paginator->lastPage() }}</a>
                </li>
            @endif 

            @if ($paginator->hasMorePages())
                <li class="page-item">
                    @php
                        $queryString = Request::getQueryString();
                        parse_str($queryString, $queryArray);
                        unset($queryArray['page']);
                        $updatedQueryString = http_build_query($queryArray);
                    @endphp

                    <a class="page-link"
                        href="{{ $paginator->nextPageUrl() }}{{ $updatedQueryString ? '&' . $updatedQueryString : '' }}"
                        rel="next" aria-label="Next">&rsaquo;</a>
                </li>
            @else
                <li class="page-item disabled" aria-disabled="true">
                    <span class="page-link">&rsaquo;</span>
                </li>
            @endif
        </ul>
    </nav>
@endif
