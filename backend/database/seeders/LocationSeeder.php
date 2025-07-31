<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['governorate' => 'Beirut', 'district' => 'Achrafieh'],
            ['governorate' => 'Beirut', 'district' => 'Hamra'],
            ['governorate' => 'Beirut', 'district' => 'Verdun'],
            ['governorate' => 'Mount Lebanon', 'district' => 'Jounieh'],
            ['governorate' => 'Mount Lebanon', 'district' => 'Baabda'],
            ['governorate' => 'Mount Lebanon', 'district' => 'Metn'],
            ['governorate' => 'North', 'district' => 'Tripoli'],
            ['governorate' => 'North', 'district' => 'Koura'],
            ['governorate' => 'North', 'district' => 'Zgharta'],
            ['governorate' => 'South', 'district' => 'Sidon'],
            ['governorate' => 'South', 'district' => 'Tyre'],
            ['governorate' => 'South', 'district' => 'Nabatieh'],
            ['governorate' => 'Bekaa', 'district' => 'Zahle'],
            ['governorate' => 'Bekaa', 'district' => 'Baalbek'],
            ['governorate' => 'Bekaa', 'district' => 'Rachaya'],
            ['governorate' => 'Nabatieh', 'district' => 'Bint Jbeil'],
            ['governorate' => 'Nabatieh', 'district' => 'Marjeyoun'],
            ['governorate' => 'Akkar', 'district' => 'Halba'],
            ['governorate' => 'Baalbek-Hermel', 'district' => 'Hermel'],
        ];

        foreach ($locations as $location) {
            Location::firstOrCreate($location);
        }
    }
}
