package com.bookfair.system.service;

import com.bookfair.system.dto.message.ReservationEmailMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailQueueProducer {

    private final SqsClient sqsClient;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    @Value("${app.aws.sqs.email-queue-url:${AWS_SQS_EMAIL_QUEUE_URL:}}")
    private String emailQueueUrl;

    public void enqueueReservationEmail(ReservationEmailMessage message) {
        if (emailQueueUrl == null || emailQueueUrl.isBlank()) {
            log.info("SQS Queue URL not configured. Delivering reservation email directly for: {}", message.getToEmail());
            emailService.sendReservationEmail(
                    message.getToEmail(),
                    message.getUserName(),
                    message.getMobileNumber(),
                    message.getPaymentStatus(),
                    message.getQrCodeBase64(),
                    message.getStallDetails()
            );
            return;
        }

        try {
            String payload = objectMapper.writeValueAsString(message);
            SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                    .queueUrl(emailQueueUrl.trim())
                    .messageBody(payload)
                    .build();

            sqsClient.sendMessage(sendMsgRequest);
            log.info("Successfully enqueued reservation email to SQS queue for recipient: {}", message.getToEmail());
        } catch (Exception e) {
            log.error("Failed to enqueue email to SQS ({}). Executing direct async fallback for: {}",
                    e.getMessage(), message.getToEmail());
            emailService.sendReservationEmail(
                    message.getToEmail(),
                    message.getUserName(),
                    message.getMobileNumber(),
                    message.getPaymentStatus(),
                    message.getQrCodeBase64(),
                    message.getStallDetails()
            );
        }
    }
}
