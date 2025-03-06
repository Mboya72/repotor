from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

def password_change(email, token):
    url = f"{current_app.config['FRONTEND_URL']}/newpassword?token={token}"
    message = Mail(
        from_email="noreply.ireporterorg@gmail.com",
        to_emails=email,
        subject="Change Your Password",
        html_content=f"""
              <html>
                <body>
                  <p>Please click <a href="{url}">here</a> to change your password.</p>
                  <p>If you did not make this request, ignore this message.</p>
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