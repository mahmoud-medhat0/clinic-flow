<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin: 10px 0; }
        .label { font-weight: bold; color: #4F46E5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Appointment Confirmation</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $appointment->patient->user->name }},</p>
            
            <p>Your appointment has been successfully created. Here are the details:</p>
            
            <div class="appointment-details">
                <div class="detail-row">
                    <span class="label">Doctor:</span> 
                    Dr. {{ $appointment->doctor->user->name }}
                </div>
                
                <div class="detail-row">
                    <span class="label">Clinic:</span> 
                    {{ $appointment->clinic->name }}
                </div>
                
                <div class="detail-row">
                    <span class="label">Service:</span> 
                    {{ $appointment->service->name }}
                </div>
                
                <div class="detail-row">
                    <span class="label">Date:</span> 
                    {{ $appointment->date->format('l, F j, Y') }}
                </div>
                
                <div class="detail-row">
                    <span class="label">Time:</span> 
                    {{ $appointment->time }}
                </div>
                
                @if($appointment->notes)
                <div class="detail-row">
                    <span class="label">Notes:</span> 
                    {{ $appointment->notes }}
                </div>
                @endif
            </div>
            
            <p>Please arrive 10 minutes before your scheduled time.</p>
            
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
        </div>
        
        <div class="footer">
            <p>ClinicFlow - Your Health, Our Priority</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
