<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Returns the appropriate view of overview
     *
     * 
     * @return \Illuminate\View\View The view instance for 'homepage'.
     */
    public function index() {
        return view('index');
    }
}
