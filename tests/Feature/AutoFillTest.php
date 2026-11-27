<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AutoFillTest extends TestCase
{
    use RefreshDatabase;

    public function test_slug_is_generated_unique_and_kept_on_rename(): void
    {
        $a = Product::create(['name' => 'Patient Monitor PM-9000']);
        $b = Product::create(['name' => 'Patient Monitor PM-9000']);

        $this->assertSame('patient-monitor-pm-9000', $a->slug);
        $this->assertSame('patient-monitor-pm-9000-2', $b->slug);

        $a->update(['name' => 'Patient Monitor Baru']);
        $this->assertSame('patient-monitor-pm-9000', $a->fresh()->slug);
    }

    public function test_slug_uses_indonesian_title_and_excerpt_comes_from_body(): void
    {
        $post = Post::create([
            'title' => ['id' => 'Cara Merawat Alat', 'en' => 'Equipment Care'],
            'body' => ['id' => '<p>Bersihkan alat <strong>setiap hari</strong>.</p><p>Paragraf kedua.</p>', 'en' => '<p>Clean it daily.</p>'],
            'excerpt' => ['en' => 'Custom summary'],
        ]);

        $this->assertSame('cara-merawat-alat', $post->slug);
        $this->assertSame('Bersihkan alat setiap hari. Paragraf kedua.', $post->excerpt['id']);
        $this->assertSame('Custom summary', $post->excerpt['en']);
    }
}
