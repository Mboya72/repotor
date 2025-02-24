from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

def send_verification_email(email, token):
    url = f"{current_app.config['FRONTEND_URL']}/verify/{token}"
    message = Mail(
        from_email="noreply@ireporter.com",
        to_emails=email,
        subject="Verify Your Account",
        html_content=f"<p>Please click <a href='{url}'>here</a> to verify your account.</p>"
    )
    
    try:
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        print("SendGrid Response Code:", response.status_code)
        print("SendGrid Response Body:", response.body)
        return response.status_code == 202
    except Exception as e:
        print("SendGrid error:", e)
        return False