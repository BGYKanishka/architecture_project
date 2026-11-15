package com.bookfair.system.service;

import com.bookfair.system.dto.message.ReservationEmailMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailQueueConsumer {

    private final SqsClient sqsClient;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;

    @Value("${app.aws.sqs.email-queue-url:${AWS_SQS_EMAIL_QUEUE_URL:}}")
    private String emailQueueUrl;

    @Value("${app.aws.sqs.consumer.rate-delay-ms:1000}")
    private long rateDelayMs;

    @Scheduled(fixedDelayString = "${app.aws.sqs.poll-interval-ms:3000}")
    public void pollEmailQueue() {
        if (emailQueueUrl == null || emailQueueUrl.isBlank()) {
            return;
        }

        try {
            ReceiveMessageRequest receiveRequest = ReceiveMessageRequest.builder()
                    .queueUrl(emailQueueUrl.trim())
                    .maxNumberOfMessages(5)
                    .waitTimeSeconds(5) // Long polling
                    .build();

            List<Message> messages = sqsClient.receiveMessage(receiveRequest).messages();
            if (messages.isEmpty()) {
                return;
            }

            log.info("Received {} email message(s) from Amazon SQS.", messages.size());

            for (Message msg : messages) {
                boolean processedSuccessfully = false;
                try {
                    ReservationEmailMessage emailMsg = objectMapper.readValue(msg.body(), ReservationEmailMessage.class);
                    emailService.sendReservationEmailSync(
                            emailMsg.getToEmail(),
                            emailMsg.getUserName(),
                            emailMsg.getMobileNumber(),
                            emailMsg.getPaymentStatus(),
                            emailMsg.getQrCodeBase64(),
                            emailMsg.getStallDetails()
                    );
                    processedSuccessfully = true;
                } catch (Exception ex) {
                    log.error("Failed to deliver email for SQS message ID {}: {}. Message retained for retry.",
                            msg.messageId(), ex.getMessage());
                }

                if (processedSuccessfully) {
                    DeleteMessageRequest deleteRequest = DeleteMessageRequest.builder()
                            .queueUrl(emailQueueUrl.trim())
                            .receiptHandle(msg.receiptHandle())
                            .build();
                    sqsClient.deleteMessage(deleteRequest);
                    log.info("Successfully processed and deleted message ID {} from SQS.", msg.messageId());
                }

                // Controlled rate throttling to strictly adhere to SES sending quotas
                if (rateDelayMs > 0) {
                    try {
                        Thread.sleep(rateDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.debug("SQS polling check skipped or encountered non-fatal status: {}", e.getMessage());
        }
    }
}
