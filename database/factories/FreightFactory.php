<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class FreightFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'from' => fake()->country(),
            'type' => $this->faker->randomElement(['private_person', 'business']),
            'mode' => $this->faker->randomElement(['land', 'air', 'sea']),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'is_residential_address' => fake()->boolean()
        ];
    }
}
