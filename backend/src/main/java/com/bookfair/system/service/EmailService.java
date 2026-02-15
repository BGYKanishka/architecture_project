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

    // @Async ensures the user doesn't wait 3 seconds for the email to send
    @Async
    public void sendReservationEmail(String toEmail, String userName, String qrCodeBase64, String stallNames) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // 'true' = multipart (needed for attachments/images)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reservation Confirmed - Colombo Book Fair");

            // HTML Content
            String htmlContent = String.format(
                    "<html>" +
                            "<body>" +
                            "<h1>Hello %s,</h1>" +
                            "<p>Your reservation for <b>%s</b> is confirmed!</p>" +
                            "<p>Please present this QR code at the entrance:</p>" +
                            "<img src='cid:qrImage' style='width:200px;height:200px;'/>" +
                            "<br/><br/>" +
                            "<p>See you at the fair!</p>" +
                            "</body>" +
                            "</html>",
                    userName, stallNames
            );

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
