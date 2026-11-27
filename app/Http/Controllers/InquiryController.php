<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Setting;
use App\Notifications\NewInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'institution' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'topic' => ['required', Rule::in(array_keys(Inquiry::TOPICS))],
            'product_id' => ['nullable', Rule::exists('products', 'id')->where('is_published', true)],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'website' => ['prohibited'], // honeypot: field tersembunyi, hanya bot yang mengisi
        ]);

        $this->verifyTurnstile($request);

        $inquiry = Inquiry::create($data + ['ip' => $request->ip()]);

        $to = config('services.inquiry_notify_email') ?: (Setting::get()['email'] ?? null);
        if ($to) {
            try {
                Notification::route('mail', $to)->notify(new NewInquiry($inquiry));
            } catch (\Throwable $e) {
                // Pesan sudah tersimpan di dashboard; gagal kirim email tidak boleh menggagalkan form.
                Log::warning('Gagal mengirim notifikasi pesan masuk', ['id' => $inquiry->id, 'error' => $e->getMessage()]);
            }
        }

        return back()->with('success', __('Terima kasih, pesan Anda sudah kami terima. Tim kami akan menghubungi Anda pada jam kerja.'));
    }

    private function verifyTurnstile(Request $request): void
    {
        $secret = config('services.turnstile.secret_key');
        if (! $secret) {
            return;
        }

        $ok = Http::asForm()->timeout(5)->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => $secret,
            'response' => $request->input('cf-turnstile-response'),
            'remoteip' => $request->ip(),
        ])->json('success');

        if (! $ok) {
            throw ValidationException::withMessages(['message' => __('Verifikasi anti-spam gagal. Muat ulang halaman lalu coba lagi.')]);
        }
    }
}
