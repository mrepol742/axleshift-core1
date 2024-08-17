<?php

namespace App\Models;

use Error;
use Exception;
use Illuminate\Foundation\Auth\User as Authenticatable;

// Freight renamed to App to avoid collisions with Freight Model
class App extends Authenticatable
{
    /**
     * The attributes that are mass encryptable.
     *
     * @var array<int, string>
     */
    protected $encryptable = [
        // User
        'first_name',
        'last_name',
    ];

    public function setAttribute($key, $value)
    {
        if ($this->isEncryptableAttribute($key)) $value = encrypt($value);
        return parent::setAttribute($key, $value);
    }

    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);
        if ($this->isEncryptableAttribute($key) && $value !== null) return decrypt($value);
        return $value;
    }

    protected function isEncryptableAttribute($key)
    {
        return in_array($key, $this->encryptable);
    }
}
