<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FreightController extends Controller
{

    /**
     * Handles a shipping request and returns the appropriate view.
     *
     *
     * @param \Illuminate\Http\Request $request The incoming HTTP request instance.
     * @param string $method The type of shipping method [land, air, sea].
     * 
     * @return \Illuminate\View\View The view instance for 'shipping'.
     */
    public function request(Request $request, $method)
    {
        return view('freight.' . $method);
    }
}
