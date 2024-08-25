<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CaptchaService
{
    protected $captchaSecretKey;

    public function __construct($captchaSecretKey)
    {
        $this->captchaSecretKey = config('captcha.SECRET_KEY');
    }

    public function verifyResponse($token)
    {
        $response = Http::post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $this->captchaSecretKey,
            'response' => $token,
        ]);

        $result = $response->json();

        return $result['success'] ?? false;
    }
}
