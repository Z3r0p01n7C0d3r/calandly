<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Meeting Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table width="600px" style="background: #ffffff; padding: 20px; border-radius: 8px;">

                    <tr>
                        <td align="center">
                            <h2 style="color: #333;">📅 Meeting Confirmed</h2>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p>Hi <strong>{{ $data['user_name'] }}</strong>,</p>

                            <p>Your meeting has been successfully scheduled. Here are the details:</p>

                            <table width="100%" cellpadding="10" style="border: 1px solid #ddd; border-radius: 5px;">
                                <tr>
                                    <td><strong>📌 Event Name:</strong></td>
                                    <td>{{ $data['event_name'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>📅 Date:</strong></td>
                                    <td>{{ $data['date'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>⏰ Time:</strong></td>
                                    <td>{{ $data['time'] }}</td>
                                </tr>
                                <tr>
                                    <td><strong>📍 Location:</strong></td>
                                    <td>{{ $data['location'] ?? 'Online' }}</td>
                                </tr>
                            </table>

                            <p style="margin-top: 20px;">
                                Please be available 5 minutes before the scheduled time.
                            </p>

                            <p>
                                If you need to reschedule or cancel, please contact us.
                            </p>

                            <br>

                            <p>Thanks,<br><strong>{{ config('app.name') }}</strong></p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
