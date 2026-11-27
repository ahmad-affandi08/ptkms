<?php

namespace Tests\Unit;

use App\Support\Translation;
use Tests\TestCase;

class TranslationTest extends TestCase
{
    public function test_picks_active_locale_and_falls_back_to_indonesian(): void
    {
        app()->setLocale('en');
        $this->assertSame('Hello', Translation::pick(['id' => 'Halo', 'en' => 'Hello']));
        $this->assertSame('Halo', Translation::pick(['id' => 'Halo', 'en' => '']));
        $this->assertSame('Halo', Translation::pick(['id' => 'Halo']));
        $this->assertSame('plain', Translation::pick('plain'));
        $this->assertNull(Translation::pick(null));

        app()->setLocale('id');
        $this->assertSame('Halo', Translation::pick(['id' => 'Halo', 'en' => 'Hello']));
    }
}
