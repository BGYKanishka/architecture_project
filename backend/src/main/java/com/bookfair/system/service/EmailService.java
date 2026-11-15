package com.bookfair.system.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String fromEmail;

    @Value("${app.public-url:http://localhost:3000}")
    private String appPublicUrl;

    @Async
    public void sendReservationEmail(String toEmail, String userName, String mobileNumber, String paymentStatus,
            String qrCodeBase64, String stallDetails) {
        try {
            sendReservationEmailSync(toEmail, userName, mobileNumber, paymentStatus, qrCodeBase64, stallDetails);
        } catch (Exception e) {
            log.error("Failed to send reservation email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    public void sendReservationEmailSync(String toEmail, String userName, String mobileNumber, String paymentStatus,
            String qrCodeBase64, String stallDetails) throws Exception {
        if (fromEmail == null || fromEmail.trim().isEmpty()) {
            log.warn("Email skipped: Sender address is not configured (APP_MAIL_FROM / SPRING_MAIL_USERNAME is empty).");
            return;
        }

        MimeMessage message = mailSender.createMimeMessage();
        // 'true' = multipart (needed for attachments/images)
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Reservation Confirmed - Colombo Book Fair");

        // HTML Content with new template
        String htmlContent = String.format(
                "<html>" +
                        "<head>" +
                        "<style>" +
                        "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }"
                        +
                        "  .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }"
                        +
                        "  .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }"
                        +
                        "  .header h1 { color: #0056b3; margin: 0; }" +
                        "  .content p { font-size: 16px; line-height: 1.5; }" +
                        "  .details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }"
                        +
                        "  .details ul { list-style-type: none; padding: 0; margin: 0; }" +
                        "  .details li { font-size: 16px; margin-bottom: 8px; }" +
                        "  .details strong { width: 140px; display: inline-block; }" +
                        "  .qr-code { text-align: center; margin-top: 20px; }" +
                        "  .qr-code img { width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 8px; padding: 10px; background: #fff; }"
                        +
                        "  .footer { text-align: center; font-size: 14px; color: #777; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }"
                        +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "  <div class='header'>" +
                        "    <h1>Colombo Book Fair</h1>" +
                        "    <h2>Reservation Confirmed</h2>" +
                        "  </div>" +
                        "  <div class='content'>" +
                        "    <p>Hello <b>%s</b>,</p>" +
                        "    <p>Thank you for reserving your stall with us. Please find your reservation details below:</p>"
                        +
                        "    <div class='details'>" +
                        "      <ul>" +
                        "        <li><strong>Mobile Number:</strong> %s</li>" +
                        "        <li><strong>Stall(s):</strong> %s</li>" +
                        "        <li><strong>Payment Status:</strong> <b>%s</b></li>" +
                        "      </ul>" +
                        "    </div>" +
                        "    <p>Please present the QR code below at the entrance for quick access.</p>" +
                        "  </div>" +
                        "  <div class='qr-code'>" +
                        "    <img src='cid:qrImage' alt='Reservation QR Code' />" +
                        "  </div>" +
                        "  <div class='footer'>" +
                        "    <p>We look forward to seeing you at the fair!</p>" +
                        "  </div>" +
                        "</div>" +
                        "</body>" +
                        "</html>",
                userName, mobileNumber, stallDetails, paymentStatus);

        helper.setText(htmlContent, true);

        // Convert Base64 QR code back to bytes
        byte[] imageBytes = Base64.getDecoder().decode(qrCodeBase64);
        ByteArrayResource imageResource = new ByteArrayResource(imageBytes);

        // Attach the image using the Content-ID 'qrImage' matched in the HTML above
        helper.addInline("qrImage", imageResource, "image/png");

        mailSender.send(message);
        log.info("Email sent successfully to: {}", toEmail);
    }

    @Async
    public void sendAccountInvitationEmail(String toEmail, String userName, String role) {
        if (fromEmail == null || fromEmail.trim().isEmpty()) {
            log.warn("Account invitation email skipped: Sender address is not configured (APP_MAIL_FROM / SPRING_MAIL_USERNAME is empty).");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Account Created - Colombo International Book Fair");

            String baseUrl = (appPublicUrl != null && !appPublicUrl.isBlank())
                    ? appPublicUrl.replaceAll("/+$", "")
                    : "http://localhost:3000";
            String registerUrl = baseUrl + "/register";

            String roleDisplay = switch (role != null ? role.toUpperCase() : "") {
                case "ADMIN" -> "System Administrator (ADMIN)";
                case "EMPLOYEE" -> "Fair Staff / Gate Security (EMPLOYEE)";
                case "VENDOR" -> "Book Vendor / Publisher (VENDOR)";
                default -> role != null ? role : "User";
            };

            String greetingName = (userName != null && !userName.isBlank()) ? userName : "there";

            String htmlContent = String.format(
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "  <meta charset=\"UTF-8\">" +
                    "  <style>" +
                    "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333333; margin: 0; padding: 24px; }" +
                    "    .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }" +
                    "    .header { text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 16px; margin-bottom: 24px; }" +
                    "    .header h1 { color: #0056b3; margin: 0; font-size: 24px; }" +
                    "    .header h2 { color: #555555; margin: 8px 0 0 0; font-size: 16px; font-weight: normal; }" +
                    "    .content p { font-size: 15px; line-height: 1.6; color: #444444; }" +
                    "    .badge-box { background-color: #e9ecef; padding: 14px 18px; border-radius: 6px; margin: 20px 0; font-size: 15px; }" +
                    "    .steps-box { background-color: #f0f7ff; border-left: 4px solid #0056b3; padding: 16px 20px; border-radius: 0 6px 6px 0; margin: 24px 0; }" +
                    "    .steps-box ol { margin: 8px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.7; color: #2c3e50; }" +
                    "    .btn-container { text-align: center; margin: 28px 0; }" +
                    "    .btn { display: inline-block; background-color: #0056b3; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 6px; }" +
                    "    .note { font-size: 13px; color: #666666; background-color: #fff9e6; border: 1px solid #ffeeba; padding: 12px 16px; border-radius: 6px; margin-top: 24px; line-height: 1.5; }" +
                    "    .footer { text-align: center; font-size: 13px; color: #888888; margin-top: 32px; border-top: 1px solid #e9ecef; padding-top: 16px; }" +
                    "  </style>" +
                    "</head>" +
                    "<body>" +
                    "  <div class=\"container\">" +
                    "    <div class=\"header\">" +
                    "      <h1>Colombo International Book Fair</h1>" +
                    "      <h2>Account Invitation</h2>" +
                    "    </div>" +
                    "    <div class=\"content\">" +
                    "      <p>Hello <b>%s</b>,</p>" +
                    "      <p>An administrator has created an account for you on the Colombo International Book Fair management portal.</p>" +
                    "      <div class=\"badge-box\">" +
                    "        <strong>Assigned Role:</strong> %s<br>" +
                    "        <strong>Registered Email:</strong> %s" +
                    "      </div>" +
                    "      <div class=\"steps-box\">" +
                    "        <strong>How to set up your password and sign in:</strong>" +
                    "        <ol>" +
                    "          <li>Click the <strong>Activate Account &amp; Set Password</strong> button below (or visit the login page).</li>" +
                    "          <li>Select <strong>Sign up</strong> on the authentication screen.</li>" +
                    "          <li>Enter your registered email address (<b>%s</b>) and choose your password.</li>" +
                    "          <li>Enter the verification code sent to your inbox to confirm your email.</li>" +
                    "        </ol>" +
                    "      </div>" +
                    "      <div class=\"btn-container\">" +
                    "        <a href=\"%s\" class=\"btn\" target=\"_blank\">Activate Account &amp; Set Password</a>" +
                    "      </div>" +
                    "      <div class=\"note\">" +
                    "        <strong>Security Note:</strong> No temporary or dummy password is required. You will securely create your own password during initial sign-up. Once verified, your account and permissions will activate automatically." +
                    "      </div>" +
                    "    </div>" +
                    "    <div class=\"footer\">" +
                    "      <p>Colombo International Book Fair Management System</p>" +
                    "    </div>" +
                    "  </div>" +
                    "</body>" +
                    "</html>",
                    greetingName,
                    roleDisplay,
                    toEmail,
                    toEmail,
                    registerUrl
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Account invitation email sent successfully to: {} with role: {}", toEmail, role);
        } catch (Exception e) {
            log.error("Failed to send account invitation email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
