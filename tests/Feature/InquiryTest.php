<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\Product;
use App\Notifications\NewInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class InquiryTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    private function payload(array $overrides = []): array
    {
        return $overrides + [
            'name' => 'dr. Rina',
            'institution' => 'RS Sehat',
            'email' => 'rina@example.com',
            'phone' => '0812 3456 7890',
            'topic' => 'quotation',
            'message' => 'Mohon penawaran 2 unit patient monitor.',
        ];
    }

    public function test_visitor_can_send_inquiry_and_office_is_notified(): void
    {
        Notification::fake();
        $product = Product::create(['slug' => 'pm', 'name' => 'Patient Monitor']);

        $this->from('/kontak')->post('/kontak', $this->payload(['product_id' => $product->id]))
            ->assertRedirect('/kontak')->assertSessionHas('success');

        $inquiry = Inquiry::sole();
        $this->assertSame('new', $inquiry->fresh()->status);
        $this->assertSame($product->id, $inquiry->product_id);
        Notification::assertSentOnDemand(NewInquiry::class, fn ($n, $channels, $notifiable) => $notifiable->routes['mail'] === 'kms.office@kmsidn.com');
    }

    public function test_invalid_input_and_bots_are_rejected(): void
    {
        $this->post('/kontak', $this->payload(['email' => 'bukan-email', 'topic' => 'hack']))->assertSessionHasErrors(['email', 'topic']);
        $this->post('/kontak', $this->payload(['website' => 'http://spam.example']))->assertSessionHasErrors('website');
        $this->post('/kontak', $this->payload(['product_id' => 999]))->assertSessionHasErrors('product_id');

        $this->assertSame(0, Inquiry::count());
    }

    public function test_form_is_rate_limited(): void
    {
        Notification::fake();
        foreach (range(1, 5) as $_) {
            $this->post('/kontak', $this->payload())->assertRedirect();
        }
        $this->post('/kontak', $this->payload())->assertStatus(429);
    }
}
