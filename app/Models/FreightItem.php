<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class FreightItem extends App 
{
    use HasFactory, Notifiable;

    protected $fillable = [
         'item_weight',
         'item_length',
         'item_width',
         'item_height',
         'item_quantity',
         'size'
    ];
}
