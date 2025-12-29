<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class SendWaMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $number;
    public $msg;
    public $number2;
    public $token;

    /**
     * Create a new job instance.
     */
    public function __construct($number, $number2, $msg, $token = null)
    {
        $this->number = $number;
        $this->number2 = $number2;
        $this->msg = $msg;
        $this->token = $token ?? env('WA_API_TOKEN');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Ensure phone numbers are in the correct format
            $this->number = $this->formatPhoneNumber($this->number);
            $this->number2 = $this->formatPhoneNumber($this->number2);

            $client = new \GuzzleHttp\Client([
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => $this->token
                ]
            ]);

            $response = $client->post(env('WA_API_ENDPOINT') . 'send-message', [
                'body' => json_encode([
                    'phone_number' => $this->number,
                    'phone_number2' => $this->number2,
                    'message' => $this->msg,
                ])
            ]);

            if ($response->getStatusCode() == 200) {
                Log::info('WhatsApp message sent successfully', [
                    'number' => $this->number,
                    'number2' => $this->number2
                ]);
            } else {
                Log::error('Failed to send WhatsApp message', [
                    'status' => $response->getStatusCode(),
                    'body' => $response->getBody()->getContents()
                ]);
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp message exception', [
                'error' => $e->getMessage(),
                'number' => $this->number
            ]);
        }
    }

    /**
     * Format phone number to Egyptian format (20XXXXXXXXXX)
     */
    private function formatPhoneNumber($number)
    {
        if ($number != null && strlen($number) < 12) {
            if ($number[0] != '0') {
                return '20' . $number;
            }
            if ($number[0] == '0') {
                return '2' . $number;
            }
        }
        return $number;
    }
}
