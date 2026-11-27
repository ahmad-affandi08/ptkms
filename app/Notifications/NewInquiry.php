<?php

namespace App\Notifications;

use App\Filament\Resources\InquiryResource;
use App\Models\Inquiry;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewInquiry extends Notification
{
    public function __construct(public Inquiry $inquiry) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $i = $this->inquiry;

        return (new MailMessage)
            ->subject("Pesan baru dari {$i->name}".($i->institution ? " ({$i->institution})" : ''))
            ->replyTo($i->email, $i->name)
            ->line('Keperluan: '.(Inquiry::TOPICS[$i->topic] ?? '-'))
            ->line('Produk: '.($i->product->name ?? '-'))
            ->line("Email: {$i->email} · Telepon: ".($i->phone ?: '-'))
            ->line($i->message)
            ->action('Buka di dashboard', InquiryResource::getUrl('index'));
    }
}
