from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

def status_change(post):
    url = f"{current_app.config['FRONTEND_URL']}/{post.user.username}/status/{post.id}"
    message = Mail(
        from_email="noreply.ireporterorg@gmail.com",
        to_emails=post.user.email,
        subject="Post Status Update",
        html_content=f"""
              <html>
                <body>
                  <div
                      style={{
                        fontFamily: "Arial, sans-serif",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "16px",
                        maxWidth: "600px",
                        margin: "16px auto",
                      }}
                    >
                      
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                        <img
                          src={post.user.profile_picture or "https://example.com/default-avatar.png"}
                          alt={post.user.username or"User"}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "12px",
                          }}
                        />
                        <div>
                          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {post.user.username}
                          </div>
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            {post.created_at}
                          </div>
                        </div>
                      </div>

                      
                      <div style={{ fontSize: "14px", color: "#333", marginBottom: "12px" }}>
                        {post.description}
                      </div>

                      
                      
                        <img
                          src={post.image_url}
                          alt="Post media"
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      
                    </div>
                    <div>
                    <p>Click <a href={url}>here</a> to view your post</p>
                    </div>
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