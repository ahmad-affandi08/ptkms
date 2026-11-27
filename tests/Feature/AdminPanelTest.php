<?php

namespace Tests\Feature;

use App\Filament\Pages\SiteSettings;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    private function user(string $role, bool $active = true): User
    {
        return User::factory()->create(['role' => $role, 'is_active' => $active]);
    }

    public function test_admin_can_open_every_admin_page(): void
    {
        $this->actingAs($this->user(User::ROLE_ADMIN));

        $pages = ['/admin', '/admin/site-settings', '/admin/users', '/admin/inquiries', '/admin/faqs', '/admin/testimonials', '/admin/partners',
            '/admin/certificates', '/admin/product-categories', '/admin/gallery-items'];
        foreach (['services', 'products', 'projects', 'posts'] as $resource) {
            array_push($pages, "/admin/{$resource}", "/admin/{$resource}/create");
        }

        foreach ($pages as $page) {
            $this->get($page)->assertOk();
        }
    }

    public function test_editor_cannot_manage_users_or_settings(): void
    {
        $this->actingAs($this->user(User::ROLE_EDITOR));

        $this->get('/admin/products')->assertOk();
        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/site-settings')->assertForbidden();
    }

    public function test_inactive_user_and_guest_are_kept_out(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');

        $this->actingAs($this->user(User::ROLE_ADMIN, active: false));
        $this->get('/admin')->assertForbidden();
    }

    public function test_admin_can_update_site_settings(): void
    {
        $this->actingAs($this->user(User::ROLE_ADMIN));

        Livewire::test(SiteSettings::class)
            ->set('data.company_name', 'PT KMS Baru')
            ->set('data.whatsapp', '6281200000000')
            ->call('save')
            ->assertHasNoErrors();

        $this->assertSame('PT KMS Baru', Setting::get()['company_name']);
        $this->get('/')->assertInertia(fn ($page) => $page->where('site.name', 'PT KMS Baru'));
    }
}
