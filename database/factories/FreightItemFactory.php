<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class FreightItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'item_weight' => fake()->randomFloat(2, 0.1, 100),
            'item_length' => fake()->randomFloat(2, 1, 200),
            'item_width' => fake()->randomFloat(2, 1, 200), 
            'item_height' => fake()->randomFloat(2, 1, 200),
            'item_quantity' => fake()->numberBetween(1, 5),
            'size' => $this->faker->randomElement(['pallet1', 'pallet2', 'pallet3', 'movingbox'])
        ];
    }
}
