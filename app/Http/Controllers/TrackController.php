<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrackController extends Controller
{

    /**
     * Returns the appropriate view for finding shipment
     *
     * 
     * @return \Illuminate\View\View The view instance for 'search'.
     */
    public function index() {
        return view('track.search');
    }

    /**
     * Handles a tracking request and returns the appropriate view.
     *
     *
     * @param \Illuminate\Http\Request $request The incoming HTTP request instance.
     * @param string $query The shipment tracking id.
     * 
     * @return \Illuminate\View\View The view instance for 'tracking'.
     */
    public function request(Request $request, $query)
    {

        return view('tracking.index');
    }
}
