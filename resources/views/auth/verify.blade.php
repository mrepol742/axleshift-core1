@extends('layouts.default')

@section('pageTitle', 'Verify')

@section('content')
<div class="container full-height d-flex justify-content-center align-items-center">
    <div class="row">
        <div class="col-md-5">
            <img src="/assets/main/port.png" class="img-fluid">
            <a class="text-muted" href="https://www.freepik.com/free-vector/port-concept-illustration_18493589.htm#fromView=search&page=1&position=0&uuid=51865418-4a1f-44d2-a031-3a5660de0b10">Image by storyset on Freepik</a>
        </div>
        <div class="col-md-7 my-md-5">
            <h1 class="offset-md-2 mb-4">{{ __('Verify Your Email Address') }}</h1>
            @if (session('resent'))
            <div class="alert alert-success" role="alert">
                {{ __('A fresh verification link has been sent to your email address.') }}
            </div>
            @endif

            {{ __('Before proceeding, please check your email for a verification link.') }}
            {{ __('If you did not receive the email') }},
            <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                @csrf
                <button type="submit" class="btn btn-gradient rounded-pill shadow-lg w-75 p-2 text-white">{{ __('click here to request another') }} &nbsp; <i class="fa-solid fa-chevron-right"></i></button>.
            </form>
        </div>
    </div>
</div>
@endsection