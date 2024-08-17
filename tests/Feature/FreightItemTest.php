<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\FreightItem;

class FreightItemTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test retrieving a freight item from the database.
     *
     * @return void
     */
    public function test_can_retrieve_freight_item_from_database()
    {
        $freightItem = FreightItem::factory()->create();

        $retrievedShipmentItem = FreightItem::find($freightItem->id);

        $this->assertNotNull($retrievedShipmentItem);
        $this->assertEquals($freightItem->item_weight, $retrievedShipmentItem->item_weight);
        $this->assertEquals($freightItem->item_length, $retrievedShipmentItem->item_length);
        $this->assertEquals($freightItem->item_width, $retrievedShipmentItem->item_width);
        $this->assertEquals($freightItem->item_height, $retrievedShipmentItem->item_height);
        $this->assertEquals($freightItem->item_quantity, $retrievedShipmentItem->item_quantity);
        $this->assertEquals($freightItem->size, $retrievedShipmentItem->size);
    }
}
