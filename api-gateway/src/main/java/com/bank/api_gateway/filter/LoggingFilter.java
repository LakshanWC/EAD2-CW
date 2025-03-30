package com.bank.api_gateway.filter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
@Order(1)  // Ensures this filter runs early in the request chain
public class LoggingFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestDetails = String.format(
                "[%s] Request: %s %s\n",
                LocalDateTime.now(),
                exchange.getRequest().getMethod(),
                exchange.getRequest().getURI()
        );

        logToFile(requestDetails);

        return chain.filter(exchange);
    }

    private void logToFile(String log) {
        try (FileWriter writer = new FileWriter("api_gateway_logs.txt", true)) {
            writer.write(log);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
