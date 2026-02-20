package com.bookfair.system.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendReservationEmail(String toEmail, String userName, String mobileNumber, String paymentStatus,
            String qrCodeBase64, String stallDetails) {
        try {
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
            System.out.println("✅ Email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}
