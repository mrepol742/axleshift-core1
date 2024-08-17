<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Freight;

class FreightTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test retrieving a freight from the database.
     *
     * @return void
     */
    public function test_can_retrieve_freight_from_database()
    {
        $freight = Freight::factory()->create();

        $retrievedShipment = Freight::find($freight->id);

        $this->assertNotNull($retrievedShipment);
        $this->assertEquals($freight->id, $retrievedShipment->id);
        $this->assertEquals($freight->from, $retrievedShipment->from);
        $this->assertEquals($freight->type, $retrievedShipment->type);
        $this->assertEquals($freight->mode, $retrievedShipment->mode);
        $this->assertEquals($freight->city, $retrievedShipment->city);
        $this->assertEquals($freight->postal_code, $retrievedShipment->postal_code);
        $this->assertEquals($freight->is_residential_address, $retrievedShipment->is_residential_address);
    }
}
