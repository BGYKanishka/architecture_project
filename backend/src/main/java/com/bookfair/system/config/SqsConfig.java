package com.bookfair.system.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;

@Slf4j
@Configuration
public class SqsConfig {

    @Value("${aws.region:${AWS_REGION:ap-southeast-2}}")
    private String awsRegion;

    @Value("${aws.access-key-id:${AWS_ACCESS_KEY_ID:}}")
    private String accessKeyId;

    @Value("${aws.secret-access-key:${AWS_SECRET_ACCESS_KEY:}}")
    private String secretAccessKey;

    @Value("${aws.session-token:${AWS_SESSION_TOKEN:}}")
    private String sessionToken;

    @Bean
    public SqsClient sqsClient() {
        Region region = Region.of(awsRegion != null && !awsRegion.isBlank() ? awsRegion : "ap-southeast-2");

        AwsCredentialsProvider credentialsProvider;
        if (accessKeyId != null && !accessKeyId.isBlank() && secretAccessKey != null && !secretAccessKey.isBlank()) {
            if (sessionToken != null && !sessionToken.isBlank()) {
                credentialsProvider = StaticCredentialsProvider.create(
                        AwsSessionCredentials.create(accessKeyId.trim(), secretAccessKey.trim(), sessionToken.trim()));
                log.info("SqsClient initialized using static session credentials for region: {}", region);
            } else {
                credentialsProvider = StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId.trim(), secretAccessKey.trim()));
                log.info("SqsClient initialized using static credentials for region: {}", region);
            }
        } else {
            credentialsProvider = DefaultCredentialsProvider.create();
            log.info("SqsClient initialized using DefaultCredentialsProvider for region: {}", region);
        }

        return SqsClient.builder()
                .region(region)
                .credentialsProvider(credentialsProvider)
                .build();
    }
}
