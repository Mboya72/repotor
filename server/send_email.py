from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

def send_verification_email(email, token):
    url = f"https://repotor.onrender.com/verify/{token}"
    message = Mail(
        from_email="noreply.ireporterorg@gmail.com",
        to_emails=email,
        subject="Verify Your Account",
        html_content=f"""
              <html>
                <body>
                  <p>Please click <a href="{url}">here</a> to verify your account.</p>
                </body>
              </html>
            """
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